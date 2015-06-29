package main

import (
	"encoding/json"
	"math/rand"
	"os"
)

var lettersRandom = []rune("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = lettersRandom[rand.Intn(len(lettersRandom))]
	}
	return string(b)
}

type entry struct {
	Hash string `json:"hash"`
	Path string `json:"path"`
	Key  string `json:"key"`
}

func readKey(path string) (map[string]entry, error) {
	keyFile, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	res := make(map[string]entry)
	var list []entry

	jsonParser := json.NewDecoder(keyFile)
	if err = jsonParser.Decode(&list); err != nil {
		return nil, err
	}

	for _, value := range list {
		res[value.Hash] = value
	}

	return res, nil
}

func writeKey(em map[string]entry, path string) error {
	var list []entry

	for _, value := range em {
		list = append(list, value)
	}

	// marshal with identation
	buf, err := json.MarshalIndent(list, "", " ")
	if err != nil {
		return err
	}

	// Write to file
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.Write(buf)
	if err != nil {
		return err
	}

	f.WriteString("\n")

	return nil
}
