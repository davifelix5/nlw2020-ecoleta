# Ecoleta
#### Conecta estabelecimentos que fazem coleta de resíduos com as pessoas que desejam descartar de forma consciente

## Funcionamento da aplicação
1. ***Backend***
    - A rota `/point` no método POST serve para cadastrar um ponto de coleta no banco de dados
      - Deve ser enviado um corpo na forma de Multipart FormData, pois o JSON não reconhece arquivos
    - A rota `/points` no método GET lista todos os de coleta. Devem ser enviados filtros de *items recolhidos*, *cidade* e *estado*
  para que sejam listados pontos específicos
    - A rota `/point/<:id>` no método GET recebe o id de um ponto específico e lista um ponto específico, junto com os items que ela coleta
    - A rota `/items` no método GET lista todos os items que podem ser recolhidos
    - Para o upload de arquivos (imagens) é usada a biblioteca *multer*
2. ***Frontend - Desktop***
    - A home tem um botão que leva para o formulário do cadastro de um ponto
    - Um dos campos desse formulário é o upload de uma imagem
3. ***Mobile***
    - Nesse parte da aplicação, são listados os pontos de coleta filtrados pela cidade e estado informados pelo usuários
    - Depois de filtrar pela cidade e estado, eles passam a ser filtrados de acordo com os itens de coleta informados pelos usuários
    
#### Filtro de por cidade e estados
- É usada uma API do IBGE para obter todas as UFs do Brasil e apresentar as cidades de acordo com a UF selecionada no campo de cidades
- É possível mudar as opções de cidade de acordo com a UF selecionada usando os estados de React

## Tecnologias utilizadas
1. ***TypeScript***
  - Essa tecnologia permite adicionar tipagem ao JavaScript tradicional
  - Permite um desenvolvimento mais eficiente, pois aumenta a capacidade da IDE de perceber quais tipos de dados devem ser utilizados
em diferentes contextos
  - Facilita o desenvolvimento em grupo
2. ***NodeJS e Express***
    - O **backend** da aplicação foi feito com uma API RESTful contruída a partir de ***NodeJS*** com o uso do framework ***express***
    - O banco de dados usado para desenvolvimento foi o ***sqlite3***
    - A biblioteca para acesso de banco de dados foi o ***knex.js***
3. ***ReactJS***
    - O **frontend** da aplicação foi feito com ReactJS
    - Conceitos como estado, imutabilidade e componentização permitem um desenvolvimento mais preciso, focado e interetivo
    - Foi feita uma SPA ***(Single Page Aplication)***, que deixa a aplicação mais fluida, aproveitando elementos de uma página para carregar a próxima
4. ***React Native + Expo***
    - O **mobile** da aplicação foi feito com React Native e Expo
    - O React Native, aproveitando conceitos do ReactJS, permite a construção de aplicações mobile nativas _cross-platform_ a partir de código
JS/TS
    - O Expo permite o acesso a elementos nativos do aparelho sem a necessidade da instação de recursos como o Android Studio
  
