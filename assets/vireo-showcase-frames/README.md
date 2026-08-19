# Frames do showcase revertido

212 frames (desktop e mobile) da tentativa de showcase por sequência de imagens,
guardados a pedido depois que a abordagem foi descartada.

**Não são usados por nenhuma página.** A animação em produção é 3D real
(`components/v2/vireo3d/`), que resolve o mesmo objetivo sem sequência de frames:
a rotação é rotação, não troca de imagens, e o peso é um mesh mais quatro texturas
em vez de dezenas de megabytes.

O script que gerou estes frames (`scripts/build-vireo-frames.py`) e os recortes
manuais que ele consumia (`assets/vireo-layers/`) foram removidos junto com a
abordagem. Estão no histórico do git, no commit anterior à reconstrução em
geometria real, caso alguém queira reler o compositor.

O pipeline atual de renders oficiais é outro e é reprodutível:

```bash
python3 scripts/extract-vireo-renders.py   # 85 renders do PDF oficial
python3 scripts/measure-vireo.py           # mede e recorta as faces
```
