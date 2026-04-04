Separamos bem as rules, mas mesmo assim gostaria de manter no @.copilot/copilot-instruction.md questões gerais, como o projeto é uma API Rest e temos  que seguir as boas práticas do Rest e que todas as funcionalidades deve ser testado e qe devemos sempre trabalhar com modo strict do Typescripy.

Vamos melhorar as rules em @.copilot/rules/testing.md.
Os testes de integração terão um sufixo *.int.test.ts.
A unidade dos testes de unidade é testar fazendo mocks quando a depedência é externa, como banco de dados, http e etc. Qualquer outra estrutura ṕde ser decçarada diretamente.
Não há problemas ter testes de unidade e de integração de um artefato, pois, podemos testar coisas mais básicas na unidade e testar a integração com dependências externas na integração.
Os testes e2e testam o sistema de ponta a ponta. Devemos preparar o banco de dados, realizar as chamadas necessárias e avaliar respostas http, status code, erro e dados recebidos;
Os testes não devem ser apenas lineares, a ideia de criar os testes é para descobrir bugs, validar comportamentos, definir documentação edge cases, por isso, precisamos segmentar cada teste, ou seja, cada teste devem validar um cenário por vez

- Dado o @docs/Produto.md eu quero um planejamento de ação global com foco em fase do projeto para organizar o desenvolvimento, este arquivo é uma visão de alto nível, não é um arquivo técnico de baixo nível. Devemos pensar nas fases, organizando fases dependentes e independentes

- Dado o @docs/high-level-plan.md e o @docs/Producto.md, eu quero um planejamento de ação baseado em cada fase/funcionalidade. A ideia é expandir a visão do que precisa ser implementado, esta é uma visõ de baixo nível da fase, quero controlar o desenvolvimento tendo um todo-list do que precisa ser feito, não é um documento que foque em condificação, mas os pontos a serem desenvolvidos

- Com base em @.copilot-intruction.md e @docs/Producto.md, eu quero um planejamento de refatoração com base na arquitetura definida na arquitetura definida e boas práticas implementandas. Organize essa refatoração em tarefas que devem ser executadas respectivament: Análise o fluxo e suas camadas, identifique os pontos criticos que atuam fora dos padrões de código e arquitetura, gere um backlog de tarefas de refatoração. O documento pode ser gerado dentro de @.copilot/copilot-intructions-refactor.md

- Dado o @.copilot-instruction.md, eu quero que extraia o workflow do Git e repasse para uma documentação separada, a ideia é segregar ao maximo as documentações em pequenos fragmentos onde serão trabalhados em baby-steps. Você pode passar esse tipo essa documentação para @.copilot/rules/workflow-git

- Dado o @docs/Produto.md e @.copilot/copilot-instruction.md, eu quero que seja gerado um planejamento de implementação para a feature de cadastro da empresa (feature/company) em @docs/tasks/company-implementation.md .Deve ser gerado uma nova migration criando a entidade company com base nos campos que a propria deve obter, além dos seus relacionamentos com outras entidades (users). Também deve ser criado uma classe de dominio para se validar as regra de negócio da entidade de dominio seguindo as convenções @.copilot/rules/domain-instruction.md, analise a necessidade de criar value-objects para valores imutaveis. Gere uma interface de repositorio para as ações necessárias no cadastro da company, essa interface deve ser utilizada na injeção de dependência afim de evitar acoplamento alto. Gerar uma fakeCompanyRepository que implemente a interface para simular o banco de dados e usado em testes de integração (camadas que interagem entre si como usecase -> validators). Implementação do repository dentro da camada de infrastructure onde será gerado a persistência dos dados com o ORM usado no projeto (mikro-orm). Implementação de usecase para orquestrar o fluxo de cadastro como um todo. Garanta que todas as camadas possuem testes (unitário e integração), após finalizar a implementação gere um teste de API (/tests/e2e/company.e2e.test.ts). Gostaria que esse planejamento esteja organizado em to-do-list para eu acompanhar todas as etapas de desenvolvimento, garantindo que esteja seguindo as convenções desejadas por mim

Capturando alterações detectadas no Staged Changes
Gere um resumo estruturado da fase Domain contendo:
  - Entidades criadas
  - Regras de negócio
  - Decisões arquiteturais
  - Pontos de atenção

Salve em docs/phases/01-domain-summary.md
