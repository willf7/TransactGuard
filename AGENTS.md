# Instruções para agentes — TransactGuard

## Estrutura do projeto

- `backend/`: API em Java 21 com Spring Boot e Maven. Código em `backend/src/main/`, testes em `backend/src/test/` e configuração de build em `backend/pom.xml`.
- `frontend/`: aplicação Angular com TypeScript, SCSS e PrimeNG. Código em `frontend/src/`, arquivos públicos em `frontend/public/` e scripts em `frontend/package.json`.
- `docs/`: documentação geral e decisões técnicas; atualmente vazia.
- `specs/`: especificações, planos e tarefas por funcionalidade; o diretório será criado ao especificar a primeira funcionalidade.
- `.specify/`: configuração, scripts, templates e workflows do Spec Kit. O caminho da constituição é `.specify/memory/constitution.md`.
- `.agents/skills/speckit-*/`: skills do fluxo Spec Kit para o Codex.

## Antes de alterar arquivos

- Leia os arquivos que pretende editar e o contexto necessário: chamadas, contratos, configuração e testes relacionados.
- Consulte a spec, o plano e as tarefas da funcionalidade, quando existirem. Verifique também a constituição quando ela for criada.
- Confira o estado do Git e preserve alterações existentes do usuário. Não descarte nem sobrescreva trabalho alheio.
- Mantenha a alteração restrita à tarefa. Evite refatorações, reformatações e atualizações de dependências sem relação com ela.
- Se código, spec e constituição divergirem, explicite o conflito antes de alterar requisitos ou princípios para acomodar a implementação.

## Comandos de desenvolvimento e validação

Execute cada comando no diretório indicado. Prefira o Maven Wrapper do projeto e o Angular CLI instalado localmente pelos scripts npm.

### Backend — diretório `backend/`

Pré-requisitos: JDK 21; Docker disponível para os testes atuais, que usam Testcontainers com Oracle Free. A primeira execução pode precisar baixar dependências e a imagem do banco.

```sh
./mvnw compile
./mvnw test
./mvnw verify
./mvnw spring-boot:run
```

- `compile`: compila o código principal.
- `test`: executa os testes.
- `verify`: percorre o ciclo de build até a verificação, incluindo testes e empacotamento.
- `spring-boot:run`: inicia a aplicação; requer configuração válida de banco e demais serviços utilizados. O arquivo de propriedades atual só define o nome da aplicação.

### Frontend — diretório `frontend/`

Use uma versão de Node.js compatível com as dependências do projeto. O `package.json` declara npm 11.16.0 como gerenciador.

```sh
npm ci
cp .env.example .env
# Defina PRIMENG_LICENSE_KEY no .env antes dos comandos seguintes.
npm start
npm run build
npm test -- --watch=false
```

- `ci`: instala dependências respeitando o lockfile; use ao preparar o ambiente ou após mudanças nas dependências.
- `start`: inicia o servidor de desenvolvimento.
- Os scripts npm de start/build/watch/test geram `src/environments/environment.generated.ts` a partir de `PRIMENG_LICENSE_KEY` no ambiente ou em `frontend/.env`. A variável do processo tem precedência; a chave não pode estar vazia.
- `.env` e o arquivo gerado são locais e ignorados pelo Git; versione somente `.env.example` sem a chave. A licença entra no bundle do navegador. Não use esse mecanismo para segredos de backend.
- `npm run test:environment`: verifica o carregamento da licença com dados fictícios; também é executado antes de `npm test`.
- `build`: gera o build de produção.
- `test -- --watch=false`: executa os testes uma vez, sem modo de observação.
- Não há configuração de testes end-to-end no projeto atualmente.

### Lint e conclusão da tarefa

- Execute sempre o lint configurado nas áreas alteradas antes de concluir uma tarefa e corrija os problemas introduzidos pela mudança.
- **Lacuna atual:** o frontend não possui script `lint` nem target correspondente em `angular.json`; o backend não possui plugin de lint/análise estática configurado no `pom.xml`.
- Enquanto essa lacuna existir, informe explicitamente que o lint não pôde ser executado por ausência de configuração. Não apresente build, compilação ou formatação como substitutos de lint.
- Quando o lint for configurado, atualize esta seção com os comandos reais. A configuração de ferramentas deve ser uma tarefa própria, salvo quando fizer parte do escopo solicitado.
- Para mudanças de código, execute build e testes pertinentes às áreas afetadas. Uma execução de `./mvnw verify` dispensa repetir `compile` e `test` sem motivo.
- Para alterações apenas documentais, revise caminhos, comandos e consistência do conteúdo; não é necessário executar o build e os testes da aplicação.
- Ao finalizar, informe o que mudou, as validações executadas e qualquer falha ou validação não realizada, com o motivo. Nunca afirme que um comando passou sem executá-lo.

## Implementação

- Siga KISS, YAGNI, DRY e SOLID de forma proporcional ao problema: prefira soluções simples, responsabilidades claras e abstrações justificadas por necessidades atuais.
- Reutilize padrões existentes. Evite criar camadas, interfaces ou dependências sem benefício concreto.
- Todo endpoint criado pela aplicação deve ter o prefixo `/api`, por exemplo `/api/transactions`. Evite duplicar o prefixo ao combinar configuração global e mapeamentos de controllers.
- Ao expor endpoints gerenciados por frameworks, confira o caminho público final para respeitar o prefixo `/api`.
- Valide entradas na API e preserve os contratos de resposta. Não exponha segredos nem dados sensíveis em respostas, logs, testes ou documentação.
- Crie ou atualize testes que verifiquem o comportamento alterado, incluindo erros e limites relevantes. Correções de bugs devem incluir teste de regressão quando viável.

## Documentação e especificações

- Atualize a documentação na mesma entrega quando mudar comportamento observável, contratos de API, configuração, variáveis de ambiente, instalação, comandos de build/teste ou decisões de arquitetura.
- Atualize este `AGENTS.md` quando mudar a estrutura do repositório, as ferramentas ou o fluxo de trabalho.
- Mantenha as specs alinhadas com mudanças de requisitos e critérios de aceitação. Registre decisões técnicas relevantes em `docs/` e referencie a spec correspondente.
- Não duplique requisitos inteiros entre este arquivo, as specs e a constituição. Prefira referências à fonte responsável por cada informação.
- Reserve a constituição para princípios duradouros e critérios de qualidade; mantenha aqui instruções operacionais e comandos específicos do repositório.
- Não altere a constituição como efeito colateral de uma implementação. Sua criação e suas revisões devem ter escopo explícito e justificativa registrada.

## Arquivos que exigem cuidado

Altere os arquivos abaixo apenas quando necessário para a tarefa e explique o motivo na entrega:

- `backend/pom.xml`, `frontend/package.json` e `frontend/package-lock.json`: dependências, versões e build. Não edite o lockfile manualmente; regenere-o com npm quando houver mudança intencional de dependências.
- `backend/mvnw`, `backend/mvnw.cmd` e `backend/.mvn/`: infraestrutura do Maven Wrapper.
- `frontend/angular.json`, `frontend/tsconfig*.json`, configurações de lint/formatação e arquivos de CI quando existirem: comportamento das ferramentas e validações.
- `.gitignore`, `.gitattributes` e configurações de editor compartilhadas: convenções do repositório.
- Migrations de banco já aplicadas, quando existirem: preserve o histórico e crie novas migrations para evoluir o schema.
- Templates e scripts do spec-kit, quando existirem: preserve o fluxo gerado e faça customizações intencionais.

Não edite manualmente artefatos gerados, como `node_modules/`, `dist/`, `target/` e caches. Não versione credenciais, arquivos locais com segredos ou configurações pessoais da IDE.

## Commits

- Use Conventional Commits, com mensagens em inglês, no formato `type(scope): short description`.
- Exemplos: `feat(api): add transaction endpoint`, `fix(frontend): validate transaction amount`, `docs(agents): document validation commands`.
- Prefira commits pequenos e coesos, com uma intenção clara. Evite misturar funcionalidades, refatorações e formatação sem relação.
- Inclua testes e documentação necessários à mudança. Não divida o trabalho de forma a deixar commits intermediários deliberadamente quebrados.
- Só crie commits ou publique alterações quando isso fizer parte do pedido do usuário.

## Pull requests

- Título: `[task-code] short description`, com a descrição em inglês. Use o código real da tarefa; não invente identificadores. Se não houver código, sinalize a ausência ao preparar o PR.
- Busque PRs com até 300 linhas alteradas, considerando adições e remoções. Divida mudanças maiores por entregas coesas quando possível.
- Esse limite é uma meta de revisão. Mudanças inseparáveis ou arquivos gerados, como lockfiles, podem justificar excedê-lo; explique a exceção na descrição.
- Escreva a descrição em inglês com as seções `What`, `Why`, `How` e `Testing`.
- `What`: comportamento ou artefato alterado e referência à tarefa/spec.
- `Why`: problema resolvido e resultado esperado.
- `How`: abordagem e decisões relevantes para o revisor.
- `Testing`: comandos executados, resultados e limitações de validação. Inclua evidência visual quando ajudar a revisar alterações de interface.
