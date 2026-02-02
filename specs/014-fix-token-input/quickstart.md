# Quickstart: Fix Token Input Visibility

## Prerequisites

- Node.js installed locally.
- Windows environment.

## Running the Fix

1.  **Navigate to worker-app**:
    ```powershell
    cd worker-app
    ```

2.  **Start the development server**:
    ```powershell
    npm run dev
    ```
    *Note: This will start the Electron app in dev mode.*

3.  **Verify the Fix**:
    - Observe the "Configurações do Worker (V2)" screen (default if not configured).
    - Verify that the "Token de Acesso" input field is visible.
    - Verify that you can type/paste a token.
    - Enter a dummy token and click "Conectar" to verify button state changes (it will likely fail connection but UI should react).
