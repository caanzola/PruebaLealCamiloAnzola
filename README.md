# Descripción general

Este es un proyecto desarrollado como prueba para la empresa Leal que se desarrolló utilizando el framework Angular con elementos gráficos de Material Design.

# Componentes

El proyecto consta de un módulo para la autenticación, por medio del cual se llama el servicio de login y se obtiene el token de acceso, el cual, se guarda en el local storage para que el módulo de transacciones lo utilice y pueda llamar el servicio que obtiene el histórico de transacciones del cliente. Para estos llamados al API se creó un módulo denóminado HttpClient en el cual se centralizan los métodos REST que invocan. los web services