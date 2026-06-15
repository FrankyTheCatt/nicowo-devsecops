# mi-app-devsecops

Aplicacion Todo App hecha con Next.js, TypeScript y Tailwind para practicar DEVSecOps y CI/CD con GitHub Actions.

## Funcionalidades

- Ver tareas pendientes y completadas.
- Agregar tareas con validacion.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- API interna en `/api/tasks`.
- Tests unitarios con Jest y React Testing Library.
- Pipeline DEVSecOps con GitHub Actions.

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm test -- --coverage
npm run build
docker build -t mi-app-devsecops:test .
```

## Pipeline DEVSecOps

Etapas:

1. Secret scan con GitLeaks.
2. Lint y TypeScript check.
3. SAST con CodeQL.
4. Build y tests con cobertura.
5. SCA con npm audit y Snyk opcional.
6. Docker build y Trivy scan.
7. Deploy a Vercel desde `main`.
8. DAST con OWASP ZAP.
9. Notificacion Slack en caso de fallo.

El pipeline aplica fail fast con dependencias `needs` entre jobs: si una etapa falla, las siguientes no continuan hasta deploy.

## Secrets

Configurar en `GitHub > Settings > Secrets and variables > Actions`.

| Secret | Uso |
|---|---|
| `VERCEL_TOKEN` | Deploy automatico a Vercel |
| `VERCEL_ORG_ID` | Identificar organizacion Vercel |
| `VERCEL_PROJECT_ID` | Identificar proyecto Vercel |
| `SNYK_TOKEN` | Escaneo SCA avanzado opcional |
| `SLACK_WEBHOOK` | Notificacion cuando falla el pipeline |
| `RAILWAY_TOKEN` | Solo si se implementa deploy alternativo a Railway |

No se deben subir archivos `.env` reales. El archivo `.env.example` solo documenta nombres de variables sin valores sensibles.

## Branch Protection sugerida

En GitHub:

1. Ir a `Settings > Branches > Add rule`.
2. Branch name pattern: `main`.
3. Activar `Require a pull request before merging`.
4. Activar `Require status checks to pass before merging`.
5. Seleccionar los jobs del pipeline.
6. Activar `Require branches to be up to date before merging`.
7. Activar `Do not allow bypassing the above settings`.

## Estrategia de ramas

| Rama | Proposito |
|---|---|
| `main` | Codigo estable/produccion. Protegida. |
| `develop` | Integracion de features. |
| `feature/nombre` | Desarrollo de funcionalidades. |
| `hotfix/nombre` | Correcciones urgentes. |
| `release/x.x.x` | Preparacion de version. |

## Convencion de commits

Usar Conventional Commits:

- `feat:` nueva funcionalidad.
- `fix:` correccion.
- `security:` parche de seguridad.
- `docs:` documentacion.
- `test:` pruebas.
- `ci:` cambios de pipeline.
- `chore:` mantenimiento.
- `refactor:` refactorizacion.

## Notas de despliegue

- Vercel es el deploy principal y requiere los secrets de Vercel antes de ejecutar el job `deploy`.
- El job `dast` usa `https://example.com` como placeholder. Reemplazarlo por la URL real de staging o produccion cuando exista.
- La imagen Docker se construye con `output: "standalone"` y ejecuta la app con el usuario no-root `nextjs`.
