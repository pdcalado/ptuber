package main

import (
	"encoding/json"
	"os"
)

type entry struct {
	Hash string `json:"hash"`
	Path string `json:"path"`
	Key  string `json:"key"`
}

func readKey(path string) ([]entry, error) {
	keyFile, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	var list []entry

	jsonParser := json.NewDecoder(keyFile)
	if err = jsonParser.Decode(&list); err != nil {
		return nil, err
	}

	return list, nil
}

func writeKey(list []entry, path string) error {
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
