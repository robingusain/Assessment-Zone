import React, { use, useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/isotope.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "isotope",
          lineNumbers: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        // console.log("changes", changes); 
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          // emit code change event
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);
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

  return <textarea id="realtimeEditor"></textarea>;
};

// const Editor = () => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     const textarea = document.getElementById("realtimeEditor");
//     if (textarea) {
//       const editor = Codemirror.fromTextArea(textarea, {
//         mode: { name: "javascript", json: true },
//         theme: "isotope",
//         lineNumbers: true,
//         autoCloseTags: true,
//         autoCloseBrackets: true,
//       });

//       // Initial size
//       editor.setSize("100%", "100%");

//       // Handle window resizing
//       const handleResize = () => {
//         editor.setSize("100%", "100%");
//       };

//       window.addEventListener("resize", handleResize);

//       // Cleanup
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         editor.toTextArea();
//       };
//     }
//   }, []);

//   return (
//     <div
//       ref={editorRef}
//       style={{
//         height: "90vh",
//         width: "100%",
//         backgroundColor: "#0B1120",
//         borderRadius: "8px",
//         overflow: "hidden",
//       }}
//     >
//       <textarea id="realtimeEditor" />
//     </div>
//   );
// };
export default Editor;
