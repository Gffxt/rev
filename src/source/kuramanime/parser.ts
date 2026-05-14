import axios from "axios";
import * as cheerio from "cheerio";
import type {
  AnimeDetails,
  Anime,
  Genre,
  AnimeVideo,
  ListAnime,
} from "../utils/types";

const BASEURL = "https://kuramanime.net";

const loadHtml = (data: unknown, errorMsg: string = "Page not found") => {
  if (!data || typeof data !== "string" || data.trim().length === 0) {
    throw new Error(errorMsg);
  }
  if (!cheerio || !cheerio.load) {
    throw new Error("Cheerio is not loaded properly");
  }
  return cheerio.load(data);
};

export const recentRelease = async (page: number = 1): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/anime/ongoing?order_by=latest&page=${page}`
    );
    const $ = loadHtml(base.data, "Page not found, you may request more than the maximum page");
    if (!$("#animeList .product__item").html()) {
      throw new Error("Page not found, you may request more than the maximum page");
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
      .last()
      .html()!;
    $("#animeList .product__item").each((i, el) => {
      return list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text()!,
        episode: ~~$(el)
          .find(".ep span")
          .text()
          .replace("Ep", "")
          .split("/")[0]
          .trim(),
        cover: $(el).attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

export const search = async (
  query: string,
  page: number = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/anime?search=${query}&order_by=latest&page=${page}`
    );
    const $ = loadHtml(base.data, "Anime not found, or you may request more than the maximum page");
    if (!$("#animeList .product__item").html()) {
      throw new Error("Anime not found,or you may request more than the maximum page");
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
      .last()
      .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        cover: $(el).attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
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
  } catch (err: any) {
    throw err;
  }
};

export const popular = async (page: number = 1): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/anime/ongoing?order_by=popular&page=${page}`
    );
    const $ = loadHtml(base.data, "Page not found, you may request more than the maximum page");
    if (!$("#animeList .product__item").html()) {
      throw new Error("Page not found, you may request more than the maximum page");
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
    .last()
    .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        episode: ~~$(el)
          .find(".ep span")
          .text()
          .replace("Ep", "")
          .split("/")[0]
          .trim(),
        cover: $(el).attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

export const genreList = async (page: number = 1): Promise<Genre[]> => {
  let list: Genre[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/properties/genre?genre_type=all&page=${page}`
    );
    const $ = loadHtml(base.data, "Page not found");
    if (!$("#animeList .kuramanime__genres li").html()) {
      throw new Error("Page not found");
    }
    $("#animeList .kuramanime__genres li").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]?.split("?")[0]!,
        title: $(el).find("a").text(),
        url: $(el).find("a").attr("href")?.trim()!,
      });
    });
    return list;
  } catch (err: any) {
    throw err;
  }
};

export const genre = async (
  genre: string,
  page: number = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/properties/genre/${genre}?order_by=latest&page=${page}`
    );
    const $ = loadHtml(base.data, "Genre not found, or you may request more than the maximum page");
    if (!$("#animeList .product__item").html()) {
      throw new Error("Genre not found, or you may request more than the maximum page");
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
    .last()
    .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        cover: $(el).attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

export const seasonList = async (page: number = 1): Promise<Genre[]> => {
  let list: Genre[] = [];
  try {
    const base = await axios.get(`${BASEURL}/properties/season?page=${page}`);
    const $ = loadHtml(base.data, "Page not found");
    if (!$("#animeList .kuramanime__genres li").html()) {
      throw new Error("Page not found");
    }
    $("#animeList .kuramanime__genres li").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!.split("?")[0]!,
        title: $(el).find("a").text(),
        url: $(el).find("a").attr("href")?.trim()!,
      });
    });
    return list;
  } catch (err: any) {
    throw err;
  }
};

export const season = async (
  season: string,
  page: number = 1
): Promise<ListAnime> => {
  let list: Anime[] = [];
  try {
    const base = await axios.get(
      `${BASEURL}/properties/season/${season}?order_by=latest&page=${page}`
    );
    const $ = loadHtml(base.data, "Season not found, or you may request more than the maximum page");
    if (!$("#animeList .product__item").html()) {
      throw new Error("Season not found, or you may request more than the maximum page");
    }
    let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
    .last()
    .html()!;
    $("#animeList .product__item").each((i, el) => {
      list.push({
        slug: $(el).find("a").attr("href")?.split("/")[5]!,
        title: $(el).find(".product__item__text>h5>a").text(),
        cover: $(el).attr("data-setbg")!,
        url: $(el).find("a").attr("href")!,
      });
    });
    return {
      page: ~~page,
      maxPage: maxPage,
      list: list,
    };
  } catch (err: any) {
    throw err;
  }
};

export const anime = async (slug: string): Promise<AnimeDetails> => {
  try {
    const base = await axios.get(`${BASEURL}/anime/${slug}`);
    const $ = loadHtml(base.data, "Anime not found");
    if (!$(".anime__details__widget ul").html()) {
      throw new Error("Anime not found");
    }
    let genre: string[] = [];
    $(".anime__details__widget ul")
      .find('span:contains("Genre:"),span:contains("Tema:")')
      .parent()
      .find("a")
      .each((i, el) => {
        genre.push($(el).text().replace(",", "").trim());
      });
    let episode = [];
    let $$ = loadHtml(
      $("#episodeListsSection > #episodeLists").attr("data-content"),
      "Episode list not found"
    );
    $$("a").each((i, el) => {
      episode.push($(el).text().trim());
    });
    return {
      slug: $('meta[property="og:url"]').attr("content")?.split("/")[5]!,
      title: $(".anime__details__title > h3").text(),
      titleAlt: $(".anime__details__title > span").text(),
      synopsis: $("#synopsisField").text(),
      episodeTotal: ~~$(".anime__details__widget ul")
        .find('span:contains("Total Eps:")')
        .next()
        .text(),
      episode: episode.length,
      season: $(".anime__details__widget ul")
        .find('span:contains("Musim:")')
        .next()
        .text(),
      genre: genre,
      cover: $(".set-bg").attr("data-setbg")!,
      url: $('meta[property="og:url"]').attr("content")!,
    };
  } catch (err: any) {
    throw err;
  }
};

export const animeVideoSource = async (
  slug: string,
  ep: number
): Promise<AnimeVideo> => {
  try {
    const url = await axios.head(`${BASEURL}/anime/${slug}`);
    const actualUrl = await url.request.res.responseUrl;
    const base = await axios.get(
      actualUrl + `/episode/${ep}?activate_stream=1`
    );
    const $ = loadHtml(base.data, "Episode not found");
    let videoSource: { quality: string; url: string }[] = [];
    if (!$("#animeVideoPlayer video").html()) {
      throw new Error("Episode not found");
    }
    $("#animeVideoPlayer video")
      .find("source")
      .each((i, el) => {
        videoSource.push({
          quality: $(el).attr("size")! + "p",
          url: $(el).attr("src")!,
        });
      });
    return {
      episode: ~~ep,
      video: videoSource,
    };
  } catch (err: any) {
    throw err;
  }
};
