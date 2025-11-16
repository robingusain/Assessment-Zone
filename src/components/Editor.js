import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/isotope.css";

import { MoonIcon, SunIcon, TrashIcon, PlayIcon } from "@heroicons/react/24/solid";

// Language modes
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/sql/sql";
import "codemirror/mode/php/php";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/clike/clike"; // C, C++, Java
import "codemirror/mode/go/go";

import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";
import TerminalView from "./Terminal"; // Terminal component

const languageModes = {
  javascript: "javascript",
  python: "python",
  xml: "xml",
  markdown: "markdown",
  css: "css",
  html: "htmlmixed",
  sql: "sql",
  php: "php",
  ruby: "ruby",
  java: "text/x-java",
  c: "text/x-csrc",
  cpp: "text/x-c++src",
  go: "go",
};

const judge0LanguageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
  php: 68,
  ruby: 72,
  go: 60,
  sql: 82,
  html: 43,
  css: 1,
  xml: 1,
  markdown: 1,
};

const boilerplates = {
  javascript: `function main() {\n  console.log("Hello, JavaScript!");\n}\nmain();`,
  python: `def main():\n    print("Hello, Python!")\n\nmain()`,
  xml: `<note>\n  <to>User</to>\n  <from>Editor</from>\n  <body>Hello, XML!</body>\n</note>`,
  markdown: `# Hello Markdown\nThis is a sample markdown document.`,
  css: `body {\n  background-color: #f0f0f0;\n  font-family: sans-serif;\n}`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello HTML</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
  sql: `SELECT * FROM users WHERE active = 1;`,
  php: `<?php\n  echo "Hello, PHP!";\n?>`,
  ruby: `def main\n  puts "Hello, Ruby!"\nend\n\nmain`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n  printf("Hello, C!\\n");\n  return 0;\n}`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Go!")\n}`,
};

const runCode = async (code, languageId, stdin = "") => {
  const response = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "21086747a9mshaaf7e03a2d2ab15p16e2d8jsnfd321bdc26dc",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin,
      }),
    }
  );
  const data = await response.json();
  return data.stdout || data.stderr || "No output";
};

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [theme, setTheme] = useState("dark");
  
    const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);

    // Toggle CodeMirror theme
    editorRef.current.setOption(
      "theme",
      newTheme === "dark" ? "isotope" : "default"
    );
  };

useEffect(() => {
  const cm = Codemirror.fromTextArea(
    document.getElementById("realtimeEditor"),
    {
      mode: languageModes[language],
      theme: "isotope",
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
    }
  );
  editorRef.current = cm;

  const handler = (instance, changes) => {
    const { origin } = changes;
    const code = instance.getValue();
    onCodeChange(code);
    if (origin !== "setValue") {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
  };

  cm.on("change", handler);
  const initialCode = boilerplates[language] || "";
  cm.setValue(initialCode);

  return () => {
    cm.off("change", handler);
    cm.toTextArea();
  };
}, [language, onCodeChange, roomId, socketRef]);

useEffect(() => {
  if (!editorRef.current) return;
  
  editorRef.current.setOption("mode", languageModes[language]);

  if (!editorRef.current.getValue().trim()) {
      editorRef.current.setValue(boilerplates[language]);
  }
}, [language]);


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const handleRun = async () => {
    const code = editorRef.current.getValue();
    const languageId = judge0LanguageMap[language];
    const result = await runCode(code, languageId, userInput);
    setOutput(result);
  };

   return (
    <div className="editor-wrapper">

      {/* STICKY TOOLBAR */}
      <div className="toolbar sticky-toolbar">

        {/* Language Select */}
        <select
          className="toolbar-btn select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.keys(languageModes).map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button className="toolbar-btn run" onClick={handleRun}>
          <PlayIcon className="icon" /> Submit
        </button>

        {/* Clear Output */}
        <button className="toolbar-btn clear" onClick={() => setOutput("")}>
          <TrashIcon className="icon" /> Clear
        </button>

        {/* Theme Toggle */}
        <button className="toolbar-btn theme" onClick={toggleTheme}>
          {theme === "dark" ? (
            <SunIcon className="icon" />
          ) : (
            <MoonIcon className="icon" />
          )}
          Theme
        </button>

      </div>

      <textarea id="realtimeEditor"></textarea>

      <textarea
        className="io-box"
        placeholder="Enter input (stdin)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <TerminalView output={output} />
    </div>
  );
};

export default Editor;
