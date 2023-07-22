import React from "react";
import { useTranslation } from "react-i18next";


import { THEMES } from "../../constant/themes";


export const Themes = () => {
  const { i18n, t } = useTranslation();

  return (
    <>
      {THEMES.map((item, index) => <option key={item} value={item}>{t(`${item}`)}</option>)}
    </>
  )
}
