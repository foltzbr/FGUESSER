# FGUESSER

O FGUESSER é um map cheat para GeoGuessr e OpenGuessr que revela a localização real de cada round e marca um pin direto no mapa de palpite.

![version](https://img.shields.io/badge/version-1.0-black) ![platform](https://img.shields.io/badge/platform-Tampermonkey-orange)

**Idioma:** Português (este arquivo) • [English](README.md) • [Español](README.es.md)

![FGUESSER em ação](preview-v1.png)

## O que faz

- Revela as coordenadas reais do Street View atual
- Mostra país, região e cidade com bandeira
- Marca um pin vermelho no mapa de palpite no ponto exato
- Miniatura do mapa OpenStreetMap com a localização real
- Interface em Português, English e Español
- Funciona no [GeoGuessr](https://www.geoguessr.com) (Classic, Streaks, Duels, Party) e no [OpenGuessr](https://openguessr.com) (grátis, rounds ilimitados)

## Instalação

1. Instale o [Tampermonkey](https://www.tampermonkey.net/)
2. Crie um novo userscript
3. Cole o conteúdo completo de `FGUESSER.user.js`
4. Salve com `Ctrl+S` e recarregue o GeoGuessr ou OpenGuessr

## Como usar

1. Entre em qualquer partida no GeoGuessr ou OpenGuessr (OpenGuessr é grátis com rounds ilimitados)
2. Aguarde o ponto verde — a localização real aparece no painel
3. Clique em `PIN ON MAP` ou aperte `6` e o pin cai no ponto exato
4. Confirme seu palpite no jogo e colete os 5000
5. Aperte `1` para esconder / mostrar o painel

## Atalhos

| Tecla | Ação |
|-------|------|
| `1` | Esconder / mostrar painel |
| `6` | Marcar pin no mapa |

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `FGUESSER.user.js` | Userscript do Tampermonkey, instale este |
| `preview-v1.png` | Prévia do painel |

## Releases

| Versão | Descrição |
|--------|-----------|
| [v1.0](https://github.com/foltzbr/FGUESSER/releases/tag/v1.0) | Autopin com pin rápido, EN / PT / ES — GeoGuessr e OpenGuessr |

Baixe o arquivo pronto na [página de releases](https://github.com/foltzbr/FGUESSER/releases).
