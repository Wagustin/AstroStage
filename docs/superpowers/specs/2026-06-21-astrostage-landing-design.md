# Especificación de Diseño: AstroStage Landing Page
**Fecha**: 2026-06-21  
**Estado**: Borrador (Aprobación Inicial)  
**Proyecto**: Landing Page de AstroStage 3D E.I.R.L.  

---

## 1. Introducción y Propósito
El objetivo de este proyecto es construir una landing page interactiva, premium y futurista para **AstroStage**, una plataforma de transmisión de conciertos holográficos interactivos en Realidad Virtual (VR) y Realidad Aumentada (AR), optimizada inicialmente para Meta Quest 3.

La página servirá para:
1. Atraer y registrar fans interesados a través de una lista de espera.
2. Explicar el funcionamiento de la aplicación y la modalidad de alquiler de visores Quest 3.
3. Posicionar comercial y legalmente la marca respaldada por **ASTROSTAGE 3D E.I.R.L.** en Perú.

---

## 2. Sistema de Diseño (Estética Inmersiva)

### Paleta de Colores
*   **Fondo Principal**: Negro Espacial Profundo (`#030014`).
*   **Fondo de Tarjetas / Contenedores**: Negro Translúcido (`rgba(8, 7, 16, 0.7)`) con efecto Glassmorphism (`backdrop-filter: blur(12px)`) y borde delgado (`1px solid rgba(255, 255, 255, 0.08)`).
*   **Acento Primario (Gradiente)**: De Cian Eléctrico (`#00f2fe`) a Púrpura de Neón (`#7f00ff`).
*   **Texto Principal**: Blanco Puro (`#ffffff`) y Blanco Atenuado (`#a0aec0`) para descripciones secundarias.
*   *Nota: Se deja preparado el sistema de variables CSS (`:root`) para facilitar cualquier cambio rápido en la gama de colores.*

### Tipografía
*   **Títulos principales**: `Outfit` (Google Fonts), sans-serif geométrica y de alto impacto.
*   **Cuerpo y descripción**: `Inter` (Google Fonts), sans-serif optimizada para máxima legibilidad.

### Logo
*   Se reserva un espacio estructurado (contenedor SVG/PNG flexible) en la esquina superior izquierda del header y en el footer.

---

## 3. Arquitectura del Sitio (Single Page / Landing)

La interfaz se estructurará en una sola página con las siguientes secciones:

### A. Barra de Navegación (Header)
*   Menú flotante con fondo difuminado (glassmorphism).
*   **Izquierda**: Contenedor para el logotipo de AstroStage.
*   **Centro**: Links de anclaje rápido: `Experiencia`, `Tecnología`, `Alquiler`, `Nosotros`.
*   **Derecha**: Botón de CTA llamativo: "Unirse a la Beta".

### B. Sección Hero
*   Título principal con tipografía gigante y gradiente brillante.
*   Párrafo introductorio de la visión espacial de AstroStage.
*   Botón interactivo "Unirse a la lista de espera" (con animación de hover suave) y "Ver Demo" (abre un reproductor simulado).

### C. Simulador Interactivo de Concierto (VR vs AR)
*   Panel interactivo con dos pestañas:
    *   **Pestaña VR (Realidad Virtual)**: Simula una vista envolvente del concierto en 360° con público y escenario virtual.
    *   **Pestaña AR (Realidad Aumentada)**: Muestra una simulación en la que el holograma del artista se proyecta en la sala de estar del usuario.
*   Usa controles deslizantes o botones interactivos sencillos construidos con HTML/CSS/JS nativo.

### D. Características y Objetivos (Grilla de Servicios)
*   **Streaming Holográfico 3D**: Captura interactiva a tiempo real.
*   **Renting de Visores**: Logística de distribución de gafas de realidad mixta para la fecha del evento.
*   **E-Commerce integrado**: Pasarelas seguras de pago para entradas de conciertos virtuales.

### E. Formulario de Captura (Waitlist)
*   Formulario minimalista y pulido que valida el correo en tiempo real.
*   Efectos visuales premium al enfocar el campo de texto y enviar el formulario.

### F. Pie de Página (Footer) y Respaldo Legal
*   Logotipo de AstroStage en formato de branding.
*   Derechos reservados y detalles de la EIRL: **AstroStage 3D E.I.R.L. - Pueblo Libre, Lima, Perú**.
*   Detalles de cumplimiento legal y políticas.

---

## 4. Implementación Técnica en Angular
La aplicación se estructurará usando componentes independientes (standalone components) en Angular 21:
*   `NavbarComponent`: Gestión de la navegación y efecto flotante.
*   `HeroComponent`: Presentación principal y botones CTA.
*   `SimulatorComponent`: Simulación interactiva VR/AR basada en CSS y layouts de imágenes.
*   `FeaturesComponent`: Grilla con tecnología y alquiler de visores.
*   `WaitlistComponent`: Formulario reactivo/plantilla con validaciones y alertas.
*   `FooterComponent`: Información corporativa y legal de la EIRL.

---

## 5. Criterios de Aceptación y Pruebas
1.  **Estética Premium**: Uso estricto de la paleta de color espacial, tipografías y efectos de desenfoque.
2.  **Responsividad**: Adaptado a móviles, tablets y monitores ultraanchos.
3.  **Interactividad**: El simulador VR/AR debe cambiar de estado de forma instantánea y fluida.
4.  **Validación del Formulario**: Protección contra correos vacíos o formatos incorrectos.
