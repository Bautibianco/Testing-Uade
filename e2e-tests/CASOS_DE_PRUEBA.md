# Casos de Prueba - Sistema de Calendario Académico

## Resumen

Total de casos de prueba implementados: **39**

---

## Historia de Usuario 01 - Registro de Usuario

**Total: 5 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-01 | test_registro_exitoso_con_datos_validos | Registro exitoso con email y contraseña válidos | CRÍTICA |
| CP-02 | test_registro_email_duplicado | Validación de email duplicado | CRÍTICA |
| CP-03 | test_registro_password_corto | Validación de contraseña corta (menos de 8 caracteres) | MEDIA |
| CP-04 | test_registro_email_invalido | Validación de formato de email inválido | MEDIA |
| CP-05 | test_registro_campos_vacios | Validación de campos vacíos | MEDIA |

---

## Historia de Usuario 02 - Inicio de Sesión

**Total: 6 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-06 | test_login_exitoso_con_credenciales_validas | Login exitoso con credenciales válidas | CRÍTICA |
| CP-07 | test_login_con_email_incorrecto | Login con email incorrecto | CRÍTICA |
| CP-08 | test_login_con_password_incorrecto | Login con contraseña incorrecta | CRÍTICA |
| CP-09 | test_login_campos_vacios | Login con campos vacíos | MEDIA |
| CP-10 | test_acceso_ruta_protegida_sin_autenticacion | Intento de acceso a rutas protegidas sin autenticación | ALTA |
| CP-11 | test_persistencia_sesion_jwt | Verificar persistencia de sesión con JWT | MEDIA |

---

## Historia de Usuario 03 - Crear Evento Académico

**Total: 7 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-12 | test_crear_evento_examen_completo | Crear evento tipo Examen con todos los campos | CRÍTICA |
| CP-13 | test_crear_evento_entrega_sin_hora | Crear evento tipo Entrega sin hora (campo opcional) | CRÍTICA |
| CP-14 | test_crear_evento_recordatorio | Crear evento tipo Recordatorio | ALTA |
| CP-15 | test_crear_evento_sin_titulo | Validación de título obligatorio | MEDIA |
| CP-16 | test_crear_evento_sin_descripcion | Validación de descripción obligatoria | MEDIA |
| CP-17 | test_crear_evento_sin_fecha | Validación de fecha obligatoria | MEDIA |
| CP-18 | test_validacion_tipos_evento | Validación de tipos de evento permitidos | MEDIA |

---

## Historia de Usuario 04 - Visualización de Calendario Mensual

**Total: 9 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-19 | test_visualizar_calendario_mes_actual | Visualizar calendario del mes actual | CRÍTICA |
| CP-20 | test_calendario_muestra_mes_y_anio | Verificar que el calendario muestra mes y año | ALTA |
| CP-21 | test_navegacion_mes_siguiente | Navegar al mes siguiente | CRÍTICA |
| CP-22 | test_navegacion_mes_anterior | Navegar al mes anterior | CRÍTICA |
| CP-23 | test_dias_con_eventos_marcados | Verificar que los días con eventos están marcados | ALTA |
| CP-24 | test_click_dia_muestra_eventos | Al hacer clic en un día, se muestran sus eventos | ALTA |
| CP-25 | test_diferenciacion_visual_por_tipo_evento | Verificar diferenciación visual por tipo de evento | MEDIA |
| CP-26 | test_calendario_sin_eventos | Visualizar calendario sin eventos | BAJA |
| CP-27 | test_eventos_solo_del_usuario_actual | Verificar que solo se muestran eventos del usuario autenticado | ALTA |

---

## Historia de Usuario 05 - Eliminar Evento

**Total: 5 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-28 | test_eliminar_evento_con_confirmacion | Eliminar evento con confirmación | CRÍTICA |
| CP-29 | test_cancelar_eliminacion_evento | Cancelar eliminación de evento | ALTA |
| CP-30 | test_modal_confirmacion_aparece | Verificar que aparece modal de confirmación | MEDIA |
| CP-31 | test_evento_eliminado_desaparece_calendario | Verificar que evento eliminado desaparece del calendario | CRÍTICA |
| CP-32 | test_solo_eliminar_eventos_propios | Verificar que solo se pueden eliminar eventos propios | ALTA |

---

## Historia de Usuario 06 - Navegación en la Interfaz

**Total: 4 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-33 | test_navbar_visible_en_todas_las_paginas | Verificar que el navbar está visible en todas las páginas | ALTA |
| CP-34 | test_navegacion_a_calendario | Navegar a la página de calendario | CRÍTICA |
| CP-35 | test_navegacion_a_nuevo_evento | Navegar a la página de nuevo evento | CRÍTICA |
| CP-36 | test_volver_calendario_desde_nuevo_evento | Volver al calendario desde nueva evento | MEDIA |

---

## Historia de Usuario 07 - Logout

**Total: 3 casos de prueba**

| ID | Nombre del Test | Descripción | Prioridad |
|----|----------------|-------------|-----------|
| CP-37 | test_logout_exitoso | Cerrar sesión exitosamente | CRÍTICA |
| CP-38 | test_sesion_eliminada_despues_logout | Verificar que la sesión se elimina después del logout | ALTA |
| CP-39 | test_cookies_eliminadas_despues_logout | Verificar que las cookies se eliminan después del logout | MEDIA |

---

## Distribución por Prioridad

- **CRÍTICA**: 13 casos
- **ALTA**: 10 casos
- **MEDIA**: 15 casos
- **BAJA**: 1 caso

---

## Cobertura por Historia de Usuario

| Historia | Casos | Porcentaje |
|----------|-------|------------|
| HU-01 | 5 | 12.8% |
| HU-02 | 6 | 15.4% |
| HU-03 | 7 | 17.9% |
| HU-04 | 9 | 23.1% |
| HU-05 | 5 | 12.8% |
| HU-06 | 4 | 10.3% |
| HU-07 | 3 | 7.7% |

---

## Notas

- Todos los tests están automatizados con Selenium WebDriver
- Se generan reportes automáticos en formato Excel
- Los tests críticos deben ejecutarse en cada build
- Los tests de regresión se ejecutan antes de cada release
