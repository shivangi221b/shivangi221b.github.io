# Assets

Drop your files here and reference them from `data.js`.

```
assets/
├── video/   demo recordings (.mp4, H.264)
├── img/     screenshots, posters, photos
└── docs/    resume.pdf, papers, reports
```

## Videos

GitHub repos have a hard 100 MB per-file limit, and GitHub Pages is not a CDN.
Rule of thumb:

| Video size | What to do |
|---|---|
| under ~20 MB | commit it to `assets/video/` and use `{ type: "video", src: "assets/video/name.mp4" }` |
| over ~20 MB | compress first (below), or upload to YouTube (unlisted) and use `{ type: "youtube", id: "..." }` |

Compress with ffmpeg — this usually cuts a screen recording by 5-10x with no
visible loss:

```bash
ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow \
       -vf "scale=1280:-2" -acodec aac -b:a 96k output.mp4
```

Grab a poster frame so the card isn't a black rectangle before play:

```bash
ffmpeg -i output.mp4 -ss 00:00:02 -vframes 1 ../img/name-poster.jpg
```

Then in `data.js`:

```js
media: { type: "video", src: "assets/video/name.mp4", poster: "assets/img/name-poster.jpg" }
```

## Your Plant Disease demo

That one already exists in the project repo as `group_presentation_video.mp4`.
Copy it in:

```bash
curl -L -o assets/video/plant-disease-demo.mp4 \
  https://github.com/shivangi221b/Plant-Disease-Detection-with-Explainable-AI/raw/main/group_presentation_video.mp4
```
