import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const TerminalView = ({ output }) => {
  const terminalRef = useRef(null);
  const term = useRef(null);

  useEffect(() => {
    term.current = new Terminal();
    term.current.open(terminalRef.current);
    term.current.write("Welcome to the Code Terminal\r\n");
  }, []);

  useEffect(() => {
    if (term.current && output) {
      term.current.clear();
      term.current.write(output.replace(/\n/g, "\r\n"));
    }
  }, [output]);

  return <div ref={terminalRef} className="terminalbox"/>;
};

export default TerminalView;
