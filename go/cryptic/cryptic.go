package main

import (
	"bytes"
	"crypto/sha1"
	"errors"
	"fmt"
	"io"
	"os"
)

func cmdEncrypt(input string, output string, pass string) string {
	cmd := fmt.Sprintf("openssl aes-256-cbc -a -salt -in %s -out %s -k '%s'",
		input, output, pass)
	return cmd
}

func cmdDecrypt(input string, output string, pass string) string {
	cmd := fmt.Sprintf("openssl aes-256-cbc -d -a -salt -in %s -out %s -k '%s'",
		input, output, pass)
	return cmd
}

func runCmd(cmd string) error {
	var buf bytes.Buffer

	cmd.Stdout = &buf
	cmd.Stderr = &buf
	err := cmd.Run()
	out := buf.Bytes()
	if err != nil {
		os.Stderr.Write(out)
		return errors.New(fmt.Sprintf("failed to run command:", err))
	}

	return nil
}

// symmetric encryption
func encryptFile(input string, output string, pass string) error {
	cmd := cmdEncrypt(input, output, pass)
	return runCmd(cmd)
}

// symmetric decryption
func decryptFile(input string, output string, pass string) error {
	cmd := cmdDecrypt(input, output, pass)
	return runCmd(cmd)
}

func ToHash(mac string) string {
	h := sha1.New()
	io.WriteString(h, mac)
	return fmt.Sprintf("%x", h.Sum(nil))
}

func main() {
	var output string
	flags.StringVar(&output, "output", "", "output directory")
	var keyfile string
	flags.StringVar(&keyfile, "keyfile", "", "file where keys are stored")

	flags.Parse()
}
