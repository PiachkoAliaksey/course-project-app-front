import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        title: "SelfColl-APP",
        search: "Search",
        logout: "Log out",
        singup: "Sign up",
        singnin:"Sign in",
        language:'Language',
        btndelete:"Delete",
        btnblock:"Block",
        btnunblock:"Unblock",
        createaccount:"Create account",
        fullname:"Full name",
        eMail:"E-Mail",
        password:"Password",
        writefullName:"Write fullName",
        writeEmail:"Write Email",
        writePassword:"Write Password",
        entertoaccount:"Enter to account",
        checkbox:"Checkbox",
        position:"Position",
        status:"Status",
        adminaccess:"Admin Access",
        useraccess: "User Access"
      },
    },
    fr: {
      translation: {
        title: "PropreColl-APP",
        search: "Chercher",
        logout: "Se deconnecter",
        singup: "S'inscrire",
        singnin:"S'identifier",
        language:'Langue',
        btndelete:"Supprimer",
        btnblock:"Bloquer",
        btnunblock:"Débloquer",
        createaccount:"Créer un compte",
        fullname:"Nom et prénom",
        eMail:"E-Mail",
        password:"Parole",
        writefullName:"Ecrire le nom complet",
        writeEmail:"Ecrire Email",
        writePassword:"Ecrire Parole",
        checkbox:"Case à cocher",
        position:"Position",
        status:"Statut",
        adminaccess:"Droit d'administrateur",
        useraccess: "Droit utilisateur"
      },
    },
  },
});

export default i18n;
