# 🌍 LangTra7 — Motor de Internacionalización Ultra Optimizado (JS Vanilla)

**LangTra7** es un sistema avanzado de internacionalización (i18n) desarrollado en JavaScript puro, diseñado para aplicaciones web modernas (como Yii2) con **alto tráfico**, sin dependencias externas y con un enfoque en **rendimiento, escalabilidad y experiencia de usuario**.

---

## 🚀 Características principales

### ⚡ 1. Traducción instantánea (DOM completo)

* Traduce **todo el contenido visible inmediatamente**
* No depende del scroll
* Experiencia fluida al cambiar idioma

---

### 🧠 2. Lazy Loading inteligente

* Traduce secciones **solo cuando entran en viewport**
* Reduce consumo de recursos
* Ideal para páginas largas o landing pages

---

### 📦 3. Cache agresivo (alto rendimiento)

* Cachea traducciones por idioma + sección
* Evita múltiples requests innecesarios
* Usa `fetch + cache: force-cache`

---

### 🔮 4. Prefetch implícito

* Prepara traducciones antes de que el usuario llegue
* Mejora percepción de velocidad

---

### 💾 5. Persistencia total

* Guarda idioma en `localStorage`
* Mantiene idioma entre:

  * páginas
  * recargas
  * sesiones

---

### 🌐 6. Detección automática de idioma

Prioridad:

```
localStorage > URL (?lang=) > navegador > español
```

* Compatible con `navigator.languages`
* Soporte multi-idioma automático

---

### 🔗 7. Sin recarga de página

* Cambia idioma sin reload
* Actualiza la URL dinámicamente:

```
?lang=en
```

---

### 🎯 8. Soporte avanzado de atributos

Traduce automáticamente:

* `placeholder`
* `title`
* `alt`
* `value`
* `aria-label`

---

### 🛡️ 9. Fallback automático

* Si falta traducción → mantiene texto original
* Evita errores visuales

---

### 🎨 10. UI feedback (UX PRO)

Incluye sistema visual:

* Loader animado
* Mensajes multi-idioma
* Confirmación de cambio

---

## 📁 Estructura del proyecto

```
/web
  /lang
    /en
      navbar.json
      home.json
    /pt
    /fr
/js
  i18n.js
```

---

## 🧩 Estructura HTML requerida

### 🔹 Definir sección

```html
<section data-i18n-section="home">
```

---

### 🔹 Texto traducible

```html
<h1 data-i18n="home.title">Bienvenido</h1>
```

---

### 🔹 Con iconos (IMPORTANTE)

```html
<a>
  <i class="fas fa-home"></i>
  <span data-i18n="navbar.home">Principal</span>
</a>
```

---

### 🔹 Atributos

```html
<input 
  data-i18n-placeholder="form.name"
  placeholder="Nombre">
```

---

## 📄 Ejemplo JSON

```
/lang/en/home.json
```

```json
{
  "home.title": "Welcome",
  "form.name": "Name"
}
```

---

## ⚙️ Configuración

Dentro del script:

```js
const CONFIG = {
  ENABLE_ANIMATION: true,
  LOADING_DURATION: 2000,
  SUCCESS_DURATION: 1500
};
```

---

## 🔄 Flujo de funcionamiento

1. Detecta idioma
2. Carga secciones del DOM
3. Traduce inmediatamente
4. Activa lazy loading
5. Guarda idioma
6. Actualiza URL

---

## 🧪 Ejemplo de uso

```html
<select id="idioma">
  <option value="es">🇦🇷 Español</option>
  <option value="en">🇺🇸 English</option>
  <option value="pt">🇧🇷 Português</option>
  <option value="fr">🇫🇷 Français</option>
</select>
```

---

## 🧠 Buenas prácticas

### ✅ SIEMPRE

* Usar `data-i18n` en texto puro
* Separar iconos del texto
* Mantener claves únicas

---

### ❌ NUNCA

```html
<a data-i18n>
  <i></i> Texto
</a>
```

---

## ⚡ Optimización para tráfico masivo

LangTra7 está optimizado para:

* Miles de usuarios concurrentes
* Reducción de requests HTTP
* Render rápido sin frameworks
* Cache en memoria del navegador

---

## 🔐 Seguridad

* No ejecuta código dinámico
* No evalúa contenido externo
* Usa JSON estático seguro

---

## 🧩 Integración con Yii2

Agregar en `main.php`:

```php
$this->registerJsFile('@web/js/i18n.js', [
    'position' => \yii\web\View::POS_END
]);
```

---

## 🧬 Posibilidades futuras

* SSR (Server Side Rendering)
* SEO multi-idioma
* Animaciones avanzadas
* Integración con APIs de traducción

---

## 🏁 Conclusión

**LangTra7** no es solo un traductor:

Es un **motor de internacionalización profesional**, optimizado para:

* rendimiento
* escalabilidad
* UX
* simplicidad

---

## 👑 Autor

Desarrollado como sistema personalizado de alto rendimiento en JavaScript Vanilla.

---

## ⚡ Estado del proyecto

✅ Producción ready
🚀 Escalable
🧠 Optimizado

---

**LangTra7 — Traducción inteligente, sin límites.**
