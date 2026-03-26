"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeVideoSource = exports.anime = exports.season = exports.seasonList = exports.genre = exports.genreList = exports.popular = exports.search = exports.recentRelease = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const decryptor_js_1 = __importDefault(require("./decryptor.js"));
const BASEURL = "https://kuronime.sbs";
const loadHtml = (data, errorMsg = "Page not found") => {
    if (!data || typeof data !== "string" || data.trim().length === 0) {
        throw new Error(errorMsg);
    }
    return cheerio.load(data);
};
const recentRelease = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/page/${page}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        let maxPage = ~~$(".postbody>.bixbox")
            .first()
            .find(".pagination a:not(.prev,.next)")
            .last()
            .text()
            .replace(",", "");
        $(".postbody>.bixbox")
            .first()
            .find(".excstf article")
            .each((i, el) => {
            return list.push({
                slug: $(el)
                    .find("a")
                    .attr("href")
                    ?.split("/")[3]
                    .replace(/\b(?:nonton-|-episode-[a-zA-Z0-9_]*)\b/gi, ""),
                title: $(el).find(".bsuxtt").text(),
                episode: ~~$(el).find(".bt .ep").text().replace("Episode", "").trim(),
                cover: $(el).find(".limit img[itemprop]").attr("data-src")?.split("?")[0] + "?resize=141,200",
                url: $(el)
                    .find("a")
                    .attr("href")
                    ?.replace(/\b(?:nonton-|-episode-[a-zA-Z0-9_]*)\b/gi, ""),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.recentRelease = recentRelease;
const search = async (query, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/page/${page}/?title=${query}&order=update`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        let maxPage = ~~$(".postbody>.bixbox")
            .first()
            .find(".pagination a:not(.prev,.next)")
            .last()
            .text()
            .replace(",", "");
        $(".postbody>.bixbox")
            .first()
            .find(".listupd article")
            .each((i, el) => {
            return list.push({
                slug: $(el).find("a").attr("href")?.split("/")[4],
                title: $(el).find("a").attr("title"),
                cover: $(el).find(".limit img[itemprop]").attr("data-src")?.split("?")[0] + "?resize=141,200",
                url: $(el).find("a").attr("href"),
            });
        });
        if (list.length == 0) {
            throw new Error("Anime not found");
        }
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.search = search;
const popular = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/popular-anime/page/${page}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        let maxPage = ~~$(".postbody>.bixbox")
            .first()
            .find(".pagination a:not(.prev,.next)")
            .last()
            .text()
            .replace(",", "");
        $(".postbody>.bixbox")
            .first()
            .find(".listupd article")
            .each((i, el) => {
            return list.push({
                slug: $(el).find("a").attr("href")?.split("/")[4],
                title: $(el).find("a").attr("title"),
                cover: $(el).find(".limit img[itemprop]").attr("data-src")?.split("?")[0] + "?resize=141,200",
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.popular = popular;
const genreList = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/genres`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        $(".postbody>.bixbox")
            .first()
            .find(".genre li")
            .each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[4],
                title: $(el).find("a").text(),
                url: $(el).find("a").attr("href"),
            });
        });
        return list;
    }
    catch (err) {
        throw err;
    }
};
exports.genreList = genreList;
const genre = async (genre, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/genres/${genre}/page/${page}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        let maxPage = ~~$(".postbody>.bixbox")
            .first()
            .find(".pagination a:not(.prev,.next)")
            .last()
            .text()
            .replace(",", "");
        $(".postbody>.bixbox")
            .first()
            .find(".listupd article")
            .each((i, el) => {
            return list.push({
                slug: $(el).find("a").attr("href")?.split("/")[4],
                title: $(el).find("a").attr("title"),
                cover: $(el).find(".limit img[itemprop]").attr("data-src")?.split("?")[0] + "?resize=141,200",
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.genre = genre;
const seasonList = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/season/winter-2023`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        $(".postbody>.bixbox")
            .first()
            .find("#season option:not([selected])")
            .each((i, el) => {
            list.push({
                slug: $(el).attr("value"),
                title: $(el).text(),
                url: `${BASEURL}/season/` + $(el).attr("value"),
            });
        });
        return list;
    }
    catch (err) {
        throw err;
    }
};
exports.seasonList = seasonList;
const season = async (season, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/season/${season}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$(".postbody").html()) {
            throw new Error("Page not found");
        }
        let maxPage = 0;
        $(".postbody>.bixbox")
            .first()
            .find(".listupd .sebox")
            .each((i, el) => {
            return list.push({
                slug: $(el).find(".tisebox a").attr("href")?.split("/")[4],
                title: $(el).find(".tisebox a").text(),
                cover: $(el).find(".bigsebox img").attr("data-src")?.split("?")[0] + "?resize=141,200",
                url: $(el).find(".tisebox a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.season = season;
const anime = async (slug) => {
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/${slug}`);
        const $ = loadHtml(base.data, "Anime not found");
        if (!$(".postbody").html()) {
            throw new Error("Anime not found");
        }
        let genre = [];
        $(".postbody article .entry-content")
            .find(".infodetail ul li:nth-child(2) a")
            .each((i, el) => {
            genre.push($(el).text());
        });
        let episode = [];
        $(".postbody article .entry-content")
            .find(".bixbox.bxcl ul li")
            .each((i, el) => {
            if (!$(el).find(".lchx a").text().match(/OVA/)) {
                episode.push($(el).find(".lchx a").text());
            }
        });
        return {
            slug: $('meta[property="og:url"]').attr("content")?.split("/")[4],
            title: $(".postbody .info-header h1.entry-title").text(),
            titleAlt: $(".postbody .infodetail ul li:first-child").text().replace("Judul:", "").trim(),
            synopsis: $(".postbody .main-info .r .conx p").text(),
            episodeTotal: ~~$(".postbody .infodetail ul li:nth-child(9)").text().split(":")[1].trim() | 0,
            episode: episode.length,
            season: $(".postbody .infodetail ul li:nth-child(6)").find("a").text(),
            genre: genre,
            cover: $(".postbody .main-info .l img").attr("data-src")?.split("?")[0] + "?resize=141,200",
            url: $('meta[property="og:url"]').attr("content"),
        };
    }
    catch (err) {
        throw err;
    }
};
exports.anime = anime;
const animeVideoSource = async (slug, ep) => {
    try {
        const base = await axios_1.default.get(`${BASEURL}/nonton-${slug}-episode-${ep}`);
        const $ = loadHtml(base.data, "Episode not found");
        if (!$(".postbody").html()) {
            throw new Error("Episode not found");
        }
        let embedUrl = $("#tonton.video-content .player-embed")
            .find("iframe")
            .attr("data-src");
        const videoSourceBase = await axios_1.default.get(embedUrl);
        const $$ = cheerio.load(videoSourceBase.data);
        if (!!$(".postbody .megavid .video-nav .iconx a").html()) {
            let enc = $$("script:not([src])")
                .first()
                .html()
                .match(/\(r\)\)\}(.*)/);
            let penc = enc[1].replace(/[\(\)"']/g, "").split(",");
            let decrypt = (0, decryptor_js_1.default)(penc[0], parseInt(penc[1]), penc[2], parseInt(penc[3]), parseInt(penc[4]), parseInt(penc[5]));
            let getSrcs = JSON.parse(decrypt.match(/srcs\s*=\s*(\[.*\])/)[1]);
            let videoSource = [];
            const waitSrc = getSrcs.map(async (el, i) => {
                try {
                    const url = await axios_1.default.get(el.file, { maxRedirects: 0 });
                    let $$$ = cheerio.load(url.data);
                    let surl = $$$("a").attr("href");
                    return {
                        quality: el.label === "HD" ? "720p" : el.label === "SD" ? "480p" : "Unknown",
                        url: surl,
                    };
                }
                catch (mediaErr) {
                    // If one source fails, continue with others
                    return { quality: el.label === "HD" ? "720p" : el.label === "SD" ? "480p" : "Unknown", url: "" };
                }
            });
            const settled = await Promise.allSettled(waitSrc);
            videoSource = settled
                .filter((r) => r.status === "fulfilled")
                .map((r) => r.value)
                .filter((item) => item.url);
            if (videoSource.length === 0) {
                throw new Error("No valid video source available");
            }
            return {
                episode: ~~ep,
                video: videoSource,
            };
        }
        else {
            throw new Error("Video source are not supported.");
        }
    }
    catch (err) {
        throw err;
    }
};
exports.animeVideoSource = animeVideoSource;
