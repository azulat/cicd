# CI/CD con GitHub, CircleCI y Vercel

Este proyecto es una aplicación de React simple (Hello World) configurada para tener un entorno de integración continua y despliegue continuo (CI/CD) usando GitHub, CircleCI y Vercel.

## Requisitos
El flujo configurado cumple con lo siguiente:
1. Al hacer un **push a la rama `main`**, se dispara el flujo en CircleCI.
2. CircleCI primero corre un **test unitario** que verifica que el texto "Hello, World!" comience con una letra mayúscula (chequeando una sola cosa de forma específica).
3. **Sólo si el test es exitoso**, CircleCI ejecuta el despliegue a producción en **Vercel**.

---

## Guía Paso a Paso

Sigue estos pasos detallados para conectar todo tu entorno correctamente.

### 1. Preparar GitHub
1. Crea un nuevo repositorio vacío en [GitHub](https://github.com/new).
2. En tu terminal local (en el directorio de este proyecto), inicializa git, realiza el primer commit y súbelo a tu repositorio remoto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

### 2. Configurar Vercel
Para que el despliegue **sólo** se haga una vez que pasen los tests en CircleCI, usaremos la CLI de Vercel desde CircleCI en lugar del autodeploy de GitHub.
1. Instala Vercel CLI globalmente en tu terminal:
   ```bash
   npm install -g vercel
   ```
2. Ejecuta el siguiente comando para vincular el proyecto a Vercel y sigue las instrucciones en la consola:
   ```bash
   vercel link
   ```
   *(Esto creará una carpeta oculta `.vercel` con tu ID de organización y de proyecto. ¡Asegúrate de NO subir la carpeta `.vercel` a GitHub! Por defecto suele estar en el `.gitignore` si se usa Vite o Next, si no, agrégala).*
3. Genera un **Token de Vercel** para que CircleCI tenga permisos de desplegar:
   - Ve a [Tokens de Vercel (Settings -> Tokens)](https://vercel.com/account/tokens).
   - Crea un nuevo token (por ejemplo con el nombre "CircleCI") y copia el valor.
4. **Desactiva los despliegues automáticos de GitHub**:
   - En el panel web de Vercel, ve a tu Proyecto -> **Settings** -> **Git**.
   - Queremos evitar que Vercel intente compilar por su cuenta apenas haces push. En la sección **Ignored Build Step**, selecciona `Command` y escribe `exit 0` (esto le dice a Vercel que ignore los builds automáticos desde GitHub).

### 3. Configurar CircleCI
1. Inicia sesión en [CircleCI](https://circleci.com/) con tu cuenta de GitHub.
2. Ve al apartado **Projects**, busca el repositorio que creaste en el paso 1 y haz clic en **Set Up Project**.
3. Te preguntará qué configuración usar. Como ya hemos creado el archivo `.circleci/config.yml` en este proyecto, indícale a CircleCI que use la **Fast (o existente)** en el repositorio en la rama `main`.
4. El primer build va a fallar porque faltan las credenciales de Vercel. 
5. Agrega las variables de entorno:
   - Ve a **Project Settings** (el ícono de engranaje en la esquina superior derecha dentro de tu proyecto en CircleCI).
   - En el menú lateral, selecciona **Environment Variables**.
   - Haz clic en **Add Environment Variable** y agrega:
     - Name: `VERCEL_TOKEN` | Value: *(Pega el token que obtuviste en el paso de Vercel)*.
     - Name: `VERCEL_ORG_ID` | Value: *(Encuéntralo en tu archivo local `.vercel/project.json`)*.
     - Name: `VERCEL_PROJECT_ID` | Value: *(Encuéntralo en tu archivo local `.vercel/project.json`)*.

*(Nota: En nuestro `.circleci/config.yml` pusimos `vercel --prod --yes --token=$VERCEL_TOKEN`. Con las tres variables cargadas en CircleCI, Vercel identificará el proyecto correctamente al desplegar)*.

### 4. Probar el Flujo Completo
1. Asegúrate de estar en la rama `main`.
2. Para comprobar que el test de hecho frena el deploy, puedes ir a `src/App.jsx` y cambiar "Hello" por "hello" (en minúscula). Si haces commit y push, verás en CircleCI que el job `test` falla, y el job `deploy` nunca se ejecuta.
3. Para probar el caso de éxito, asegúrate que diga "Hello, World!" y luego ejecuta:
   ```bash
   git add .
   git commit -m "Prueba de CI/CD completa"
   git push origin main
   ```
4. Ingresa a CircleCI, verás que:
   - Se corre el trabajo de testeo unitario.
   - Una vez aprobado, comienza automáticamente el trabajo de despliegue a Vercel.
5. ¡Ve a Vercel y comprueba que la última versión de tu código está en producción!
