import React from "react";
import { THEMES } from "../../constant/themes";


export const Themes = ()=>{

  return(
    <>
    {THEMES.map((item,index)=><option key={item} value={item}>{item}</option>)}
    </>
  )
}
