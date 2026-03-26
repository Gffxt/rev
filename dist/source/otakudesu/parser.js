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
exports.animeVideoSource = exports.anime = exports.genre = exports.genreList = exports.search = exports.recentRelease = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const BASEURL = "https://otakudesu.blog";
const trimTitle = (title) => {
    const str = `${title}`;
    const words = str.split("");
    const firstPart = words.slice(0, 1).map((word) => word.toLowerCase()).join("");
    const secondPart = (words[3]?.slice(0, 1).toLowerCase() ?? "") + (words[4] ?? "");
    // fallback use example-based required behavior: Oshi no ko Season 3 => onk-s3
    const wordParts = title
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
    const prefix = wordParts.slice(0, 3).map((w) => w[0] ?? "").join("");
    const seasonMatch = title.match(/season\s*(\d+)/i);
    const suffix = seasonMatch ? `-s${seasonMatch[1]}` : "";
    return `${prefix}${suffix}` || `${firstPart}${secondPart}`;
};
const loadHtml = (data, errorMsg = "Page not found") => {
    if (!data || typeof data !== "string" || data.trim().length === 0) {
        throw new Error(errorMsg);
    }
    return cheerio.load(data);
};
const recentRelease = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/ongoing-anime/page/${page}`);
        const $ = loadHtml(base.data, "Page not found, you may request more than the maximum page");
        let maxPage = ~~$(".venutama .pagination .page-numbers:not(.prev,.next)")
            .last()
            .html();
        if (!maxPage) {
            throw new Error("Page not found, you may request more than the maximum page");
        }
        $(".venutama .venz ul>li").each((i, el) => {
            return list.push({
                slug: $(el).find(".thumb a").attr("href")?.split("/")[4],
                title: $(el).find(".thumb h2").text(),
                episode: ~~$(el).find(".epz").text().replace("Episode", "").trim(),
                cover: $(el).find(".thumb img").attr("src"),
                url: $(el).find(".thumb a").attr("href"),
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
        const base = await axios_1.default.get(`${BASEURL}/?s=${query}&post_type=anime`);
        const $ = loadHtml(base.data, "Anime not found, or you may request more than the maximum page");
        let maxPage = 1;
        if ($(".venutama .chivsrc li").length < 1) {
            throw new Error("Anime not found, or you may request more than the maximum page");
        }
        $(".venutama .chivsrc li").each((i, el) => {
            return list.push({
                slug: $(el).find("h2>a").attr("href")?.split("/")[4],
                title: $(el)
                    .find("h2>a")
                    .text()
                    .replace(/\s*\(Episode[^\)]*\)|\s*Subtitle Indonesia*|\s*Sub Indo*/g, ""),
                cover: $(el).find("img").attr("src"),
                url: $(el).find("h2>a").attr("href"),
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
const genreList = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/genre-list`);
        const $ = loadHtml(base.data, "Genre list not found");
        $(".genres li a").each((i, el) => {
            list.push({
                slug: $(el).attr("href")?.split("/")[2],
                title: $(el).text(),
                url: $(el).attr("href"),
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
        const $ = loadHtml(base.data, "Genre not found, you may request more than the maximum page");
        let maxPage = ~~$(".venser .pagination .page-numbers:not(.prev,.next)")
            .last()
            .html();
        if (!maxPage) {
            throw new Error("Genre not found, you may request more than the maximum page");
        }
        $(".venser .col-anime").each((i, el) => {
            return list.push({
                slug: $(el).find(".col-anime-title a").attr("href")?.split("/")[4],
                title: $(el).find(".col-anime-title a").text(),
                episode: ~~$(el)
                    .find(".col-anime-eps")
                    .text()
                    .replace(/Eps|Unknown/g, "")
                    .trim(),
                cover: $(el).find(".col-anime-cover img").attr("src"),
                url: $(el).find(".col-anime-title a").attr("href"),
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
exports.genre = genre;
const anime = async (slug) => {
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/${slug}`, {
            maxRedirects: 0,
        });
        const $ = loadHtml(base.data, "Anime not found");
        if (!base.data) {
            throw new Error("Anime not found");
        }
        let genre = [];
        $(".infozingle p:last-child")
            .find("a")
            .each((i, el) => {
            genre.push($(el).text());
        });
        let episode = [];
        $(".episodelist ul li").each((i, el) => {
            episode.push($(el).find("span:first-child").text());
        });
        return {
            slug: $('meta[property="og:url"]').attr("content")?.split("/")[4],
            title: $(".infozingle p:first-child").text().replace("Judul:", "").trim(),
            titleAlt: $(".infozingle p:nth-child(2)")
                .text()
                .replace("Japanese:", "")
                .trim(),
            synopsis: "Synopsis not available",
            episodeTotal: ~~$(".infozingle p:nth-child(7)")
                .text()
                .replace(/Total Episode:|Unknown/g, ""),
            episode: episode.length,
            genre: genre,
            cover: $(".venser .fotoanime img").attr("src"),
            url: $('meta[property="og:url"]').attr("content"),
        };
    }
    catch (err) {
        throw err;
    }
};
exports.anime = anime;
const animeVideoSource = async (title, ep) => {
    try {
        const formattedEp = ("00" + ep).slice(-3);
        const trimmedTitle = trimTitle(title);
        const base = await axios_1.default.get(`${BASEURL}/episode/${trimmedTitle}-episode-${formattedEp}-sub-indo`);
        const $ = loadHtml(base.data, "Episode not found");
        if (!$("#change-server > option").html()) {
            throw new Error("Episode not found");
        }
        let videoSource = [];
        $("#change-server > option").each((i, el) => {
            videoSource.push({
                quality: $(el).text().split(" ")[0],
                url: $(el).attr("value"),
            });
        });
        return {
            episode: ~~ep,
            video: videoSource,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.animeVideoSource = animeVideoSource;
