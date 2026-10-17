# Studio 74 — sitio

Sitio del estudio: **[studio74dev.github.io](https://studio74dev.github.io/)**

HTML, CSS y JavaScript sin frameworks ni paso de build. Se edita y se sube, nada más.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa: hero, nosotros, proyectos, stack y contacto. |
| `css/styles.css` | Todos los estilos. Los colores de marca salen de las variables de `:root` (`--signal` es el lima, `--ink` el negro). |
| `js/main.js` | Menú, carrusel, animaciones y el envío del formulario. |
| `contact.php` | Relay del formulario para el hosting con PHP (Hostinger). |
| `404.html` | Página de error propia. Lleva los estilos en línea, así que no depende del CSS. |
| `assets/img/` | Capturas de los proyectos, solo en WebP. |
| `assets/firma/` | Logo y firma de mail del equipo. No los usa la web. |
| `docs/plantillas-email.md` | Plantillas para responder las consultas. Tampoco las usa la web. |
| `robots.txt`, `sitemap.xml`, `favicon.*` | Lo de siempre. |

## Probarlo en local

Cualquier servidor de archivos estáticos sirve:

```
py -m http.server 8800 --bind 127.0.0.1
```

Y abrir `http://127.0.0.1:8800/`.

> **No lo levantes con PHP en local.** `contact.php` con un sendmail de prueba contesta
> "enviado" sin mandar nada: un falso éxito, justo lo que el sitio evita. El servidor
> estático reproduce a GitHub Pages: el PHP falla, entra Web3Forms y el mail llega de verdad.

## Cómo sale el formulario

El orden está en `js/main.js`:

1. **`contact.php`** — para cuando el sitio viva en un hosting con PHP.
2. **Web3Forms** — relay para hosting estático, que es lo que usa GitHub Pages hoy.
3. **`mailto:`** — último recurso: abre el cliente de correo del visitante con el mensaje ya escrito.

Si los tres fallan, el visitante ve el error. Nunca un "enviado" que no salió.

La key de Web3Forms es pública a propósito: así funciona el servicio. Sirve para *enviar*
al mail del estudio, no para leer lo que llegó.

## Publicar

`git push` a `main` y GitHub Pages lo publica en un minuto o dos.

Dos cosas a tener en cuenta:

- GitHub Pages manda `Cache-Control: max-age=600`, también para el HTML. Después de publicar
  puede hacer falta un `Ctrl+Shift+R` para ver los cambios.
- El CSS y el JS se piden con `?v=N`. **Subí ese número cada vez que los toques**, si no,
  quien ya visitó el sitio va a seguir viendo la versión vieja por diez minutos.

## Pendientes anotados

- Dominio propio `studio74dev.com` (hoy `studio74dev.github.io` es provisional). Cuando
  esté, hay que actualizar `canonical`, `og:url`, las URLs de `sitemap.xml`, `robots.txt`,
  el JSON-LD de `index.html` y el mail de la firma.
- Testimonio real de un cliente y capturas de los proyectos en desarrollo.
