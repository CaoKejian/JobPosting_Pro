import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import s from './Block.module.scss'
import JsonView from '@uiw/react-json-view'
import useCopyToClipboard from '../hooks/useCopy'
import './index.css'
interface IProps {
  children?: ReactNode
  desc: String
  jsonObj: {}
}

const Block: FC<IProps> = ({ desc, jsonObj }) => {
  const { isCopied, copyButtonRef, copyTextToClipboard } = useCopyToClipboard();
  const [svg, setSvg] = useState('#down')
  const [isShowBlock, setIsShowBlock] = useState(true)
  const [isBlockVisible, setIsBlockVisible] = useState(true);
  const onFold = () => {
    setIsBlockVisible(!isBlockVisible);
    if (svg === '#right') {
      setSvg('#down')
      setIsShowBlock(true)
    } else {
      setSvg('#right')
      setIsShowBlock(false)
    }
  }
  const handleCopyClick = () => {
    copyTextToClipboard(JSON.stringify(jsonObj))
    if(isCopied){
      alert('复制成功')
    }
  };
  return (
    <div className={s.wrapper}>
      <h1>请求示例</h1>
      <p className={s.desc}>{desc}</p>
      <div className={s.container}>
        <div className={s.title}>
          <svg className={s.svg} onClick={onFold}><use xlinkHref={svg}></use></svg>
          <div className={s.title_right}>
            <span className={s.json}>JSON |</span>
            <svg className={s.svg} ref={copyButtonRef} onClick={handleCopyClick}><use xlinkHref='#copy'></use></svg>
            <span>复制代码</span>
          </div>
        </div>
        <div className={[`block ${isBlockVisible ? 'show' : ''}`].join()}>
          {isShowBlock ?
            <JsonView value={jsonObj}></JsonView> : null
          }
        </div>
      </div>
    </div>
  )
}

export default memo(Block)