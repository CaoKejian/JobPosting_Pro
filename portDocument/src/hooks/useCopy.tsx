import { useState, useRef } from 'react';

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const copyButtonRef = useRef(null);

  const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopied(true);
        })
        .catch((error) => {
          console.error('复制失败:', error);
        });
    }
  };

  const resetCopyStatus = () => {
    setIsCopied(false);
  };

  return {
    isCopied,
    copyButtonRef,
    copyTextToClipboard,
    resetCopyStatus,
  };
}

export default useCopyToClipboard;
