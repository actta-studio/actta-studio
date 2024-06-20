const asyncHandler = require("../utils/async-handler");
const { PrismicError } = require("@prismicio/client");
const { client } = require("../config/index");
const { siteConfig } = require("../config/index");

const router = require("express").Router();

const handleDefaultRequests = async (lang) => {
  lang = siteConfig.supportedLanguages.includes(lang)
    ? lang + "-ca"
    : siteConfig.defaultLanguage + "-ca";

  const navigation = await client
    .getSingle("navigation", { lang })
    .catch((err) => {
      if (
        !(err instanceof PrismicError) ||
        err.message !== "No documents were returned"
      ) {
        console.log(err);
      }
      return null;
    });

  const meta = await client.getSingle("metadata", { lang }).catch((err) => {
    if (
      !(err instanceof PrismicError) ||
      err.message !== "No documents were returned"
    ) {
      console.log(err);
    }
    return null;
  });

  return {
    navigation,
    meta,
  };
};

const parseLang = (lang) => {
  switch (lang) {
    case "en" || "en-ca":
      return "en-ca";
    case "fr" || "fr-ca":
      return "fr-ca";
    default:
      return lang;
  }
};

const checkLanguage = async (req, res, next) => {
  const lang = req.params.lang;

  const defaults = await handleDefaultRequests(lang);

  if (!siteConfig.supportedLanguages.includes(lang)) {
    return res
      .status(404)
      .render("pages/404", { lang: siteConfig.defaultLanguage, ...defaults });
  }
  next();
};

router.get("/", (req, res) => {
  res.redirect(siteConfig.defaultLanguage);
});

router.get(
  "/:lang/*",
  checkLanguage,
  asyncHandler(async (req, res) => {
    const lang = req.params.lang;

    const defaults = await handleDefaultRequests(lang);

    res.status(404).render("pages/404", { lang, ...defaults });
  })
);

router.get(
  "/:lang",
  checkLanguage,
  asyncHandler(async (req, res, next) => {
    const lang = req.params.lang;

    if (!lang) {
      return next(new Error("Language parameter is missing"));
    }

    const defaults = await handleDefaultRequests(lang);

    const document = await client
      .getSingle("homepage", {
        lang: parseLang(lang) || "",
      })
      .catch((err) => {
        if (
          !(err instanceof PrismicError) ||
          err.message !== "No documents were returned"
        ) {
          console.log(err);
        }
        return null;
      });

    console.log("homepage :=>", defaults.navigation.data.contact_information);

    if (!document) {
      res.status(404).render("pages/404", { lang, ...defaults });
    } else {
      res.render("pages/home", { lang, ...defaults, document });
    }
  })
);

router.get("*", (req, res) => {
  const defaults = handleDefaultRequests(siteConfig.defaultLanguage);
  res.status(404).render("pages/404", {
    lang: siteConfig.defaultLanguage,
    ...defaults,
  });
});

module.exports = router;
