# To-do App Frontend

Este é o frontend da aplicação de lista de tarefas. Ele foi desenvolvido para ser uma interface de usuário intuitiva e responsiva que se comunica com uma API backend para gerenciar as tarefas.

## Tecnologias

* **React**: Biblioteca JavaScript para construção da interface de usuário.
* **Vite**: Ferramenta de build rápida para o desenvolvimento.
* **Axios**: Cliente HTTP para consumir a API do backend.
* **TypeScript**: Adiciona tipagem estática para um código mais robusto e seguro.
* **Design Patterns**: Aplicação de padrões como **Container/Presenter** para separar a lógica de negócios da interface.
* **SOLID**: Princípios de design de software aplicados para um código limpo, coeso e escalável.
* **Clean Code**: Boas práticas de programação para um código legível e fácil de manter.

## Como Rodar o Frontend

Siga estas instruções para configurar e rodar o projeto em sua máquina local.

### 1. Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) instalados em sua máquina.

### 2. Configuração do Ambiente

1.  Clone o repositório do frontend:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio-front.git](https://github.com/seu-usuario/seu-repositorio-front.git)
    cd seu-repositorio-front
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto. Este arquivo será usado para armazenar a URL da API do seu backend.

    ```env
    VITE_API_URL="[https://seu-backend.onrender.com](https://seu-backend.onrender.com)"
    ```
    *Substitua a URL acima pela URL do seu backend no Render.*

### 3. Execução

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
O projeto estará disponível em http://localhost:5173 (ou em outra porta, conforme configurado pelo Vite).

Sobre a Arquitetura
Este frontend foi desenvolvido com o objetivo de ser modular e de fácil manutenção, seguindo princípios de arquitetura de software:

Separação de Preocupações: A lógica da interface de usuário (components) é separada da lógica de negócios (hooks ou services).

Consumo da API: O uso do Axios centraliza as chamadas para a API, facilitando a manutenção e a reutilização de código.

Boas Práticas: Princípios SOLID e Clean Code foram aplicados para garantir que cada componente e função tenha uma responsabilidade única e que o código seja legível e extensível.
  ```
