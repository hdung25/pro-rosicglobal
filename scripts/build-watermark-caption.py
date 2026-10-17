import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
font=TTFont('node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-400-normal.woff')
glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); scale=18/font['head'].unitsPerEm
text='HONG TAM ROSIC GLOBAL'
width=sum(glyphs[cmap[ord(c)]].width*scale for c in text)
x=(1200-width)/2; paths=[]
for c in text:
    glyph=glyphs[cmap[ord(c)]]
    pen=SVGPathPen(glyphs)
    glyph.draw(TransformPen(pen,(scale,0,0,-scale,x,28)))
    paths.append(pen.getCommands()); x+=glyph.width*scale
svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="42"><rect width="1200" height="42" fill="#183c2c" fill-opacity=".48"/><path d="'+''.join(paths)+'" fill="white" fill-opacity=".8"/></svg>'
Path('lib/watermark-caption.js').write_text('export const captionSvg = '+json.dumps(svg)+';\n',encoding='utf-8')
