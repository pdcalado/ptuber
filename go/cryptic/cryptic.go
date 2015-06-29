package main

import (
	"bytes"
	"crypto/sha1"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

const (
	globalAlgo    = "aes-256-cbc"
	globalSeqSize = 20
)

func cmdEncrypt(input string, output string, pass string) *exec.Cmd {
	pass = fmt.Sprintf("'%s'", pass)

	cmd := exec.Command("openssl", globalAlgo, "-a", "-salt", "-in",
		input, "-out", output, "-k", pass)

	return cmd
}

func cmdDecrypt(input string, output string, pass string) *exec.Cmd {
	pass = fmt.Sprintf("'%s'", pass)

	cmd := exec.Command("openssl", globalAlgo, "-d", "-a", "-salt", "-in",
		input, "-out", output, "-k", pass)

	return cmd
}

func runCmd(cmd *exec.Cmd, name string) error {
	cmd.Dir = filepath.Dir(".")

	var buf bytes.Buffer

	cmd.Stdout = &buf
	cmd.Stderr = &buf
	err := cmd.Run()
	out := buf.Bytes()
	if err != nil {
		os.Stderr.Write(out)
		return errors.New(fmt.Sprintf("failed to run command to get %s", name))
	}

	return nil
}

// symmetric encryption
func encryptFile(input string, output string, pass string) error {
	cmd := cmdEncrypt(input, output, pass)
	return runCmd(cmd, "encrypt")
}

// symmetric decryption
func decryptFile(input string, output string, pass string) error {
	cmd := cmdDecrypt(input, output, pass)
	return runCmd(cmd, "decrypt")
}

func ToHash(mac string) string {
	h := sha1.New()
	io.WriteString(h, mac)
	return fmt.Sprintf("%x", h.Sum(nil))
}

func main() {
	var output string
	flag.StringVar(&output, "output", "", "output directory")
	var keyfile string
	flag.StringVar(&keyfile, "keyfile", "", "file where keys are stored")
	var op string
	flag.StringVar(&op, "op", "enc", "enc or dec")

	flag.Parse()

	if keyfile == "" || output == "" {
		panic("keyfile and output must be provided")
	}

	fileList := make(map[string]bool)

	for true {
		filePath := ""
		n, err := fmt.Scanln(&filePath)
		if n <= 0 || err == io.EOF {
			fmt.Println("Done.")
			break
		}

		fileList[filePath] = true
	}

	fmt.Printf("Handling %d files\n", len(fileList))

	var list map[string]entry
	if _, err := os.Stat(keyfile); err == nil {
		list, err = readKey(keyfile)
		if err != nil {
			panic(err)
		}
	} else {
		list = make(map[string]entry)
	}

	// Check existing files
	for file, _ := range fileList {
		hash := ToHash(file)

		_, err := os.Stat(output + hash)
		if err == nil {
			fileList[file] = false
			fmt.Println("Skipping", file)
			continue
		}

		_, ok := list[hash]
		if ok {
			fileList[file] = false
			fmt.Println("Skipping", file)
			continue
		}
	}

	// start converting files
	for file, _ := range fileList {
		e := entry{
			Path: file,
			Hash: ToHash(file),
			Key:  randSeq(globalSeqSize),
		}

		fmt.Println("Encrypting", file)
		err := encryptFile(file, output+e.Hash, e.Key)
		if err != nil {
			fmt.Println("encryption failed:", err)
			continue
		}

		list[e.Hash] = e
	}

	defer func() {
		t := time.Now().UTC().Unix()
		name := fmt.Sprintf("key_%v.json", t)
		err := writeKey(list, name)
		if err == nil {
			fmt.Println("Wrote", name)
			return
		}

		panic("failed to write json file")
	}()

}
