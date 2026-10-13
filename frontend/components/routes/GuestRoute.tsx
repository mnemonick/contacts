import { useEffect, useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import Button from "#/components/Button.tsx";
import Tooltip from "#/components/Tooltip.tsx";
import Electrons from "#/components/Electrons.tsx";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import LoginModal from "#/components/modals/LoginModal.tsx";
import RegisterModal from "#/components/modals/RegisterModal.tsx";

export default function () {
  const [, setLocation] = useLocation();
  const layout = useLayout();
  const [modal, setModal] = useState<"LOGIN" | "REGISTER" | "NONE">("NONE");

  const $route: CSSProperties = {
    height: "100%",
    color: colors.text.medium,
    background: colors.gradient,
    fontSize: layout.desktop ? 18 : 16
  };

  const $routeHeader: CSSProperties = {
    color: colors.text.strong,
    fontFamily: "Montserrat",
    height: 60,
    display: "grid",
    placeItems: "center",
    fontSize: "24px",
    borderBottom: `1px solid ${colors.border.medium}`
  };

  const $routeBody: CSSProperties = {
    height: `calc(100% - ${$routeHeader.height}px)`,
    overflowY: "scroll"
  };

  const $routeContent: CSSProperties = {
    display: "flow-root",
    position: "relative",
    minHeight: "100%"
  };

  const $sections: CSSProperties = {
    width: "100%",
    maxWidth: 1024,
    position: "relative",
    left: layout.left,
    paddingBottom: layout.desktop ? 150 : 90
  };

  const $heading: CSSProperties = {
    height: 60,
    fontSize: layout.desktop ? 22 : 18,
    color: colors.text.strong,
    fontWeight: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: `1px solid ${colors.border.weak}`
  };

  const $section: CSSProperties = {
    borderTop: `1px solid ${colors.border.strong}`,
    borderRight: `1px solid ${colors.border.strong}`,
    borderBottom: `1px solid ${colors.border.strong}`,
    borderLeft: `1px solid ${colors.border.strong}`,
    borderRadius: 10,
    marginTop: layout.desktop ? 40 : 20,
    marginBottom: layout.desktop ? 40 : 20,
    marginLeft: layout.desktop ? 0 : 20,
    marginRight: layout.desktop ? 0 : 20,
    background: colors.section,
    lineHeight: "21px",
    fontFamily: "Montserrat"
  };

  const $paragraph: CSSProperties = {
    margin: 20
  };

  useEffect(() => {
    const credentials = localStorage.username && localStorage.password;

    if (credentials) {
      setLocation("/user");
    }
  });

  return (
    <route style={$route}>
      <route-header style={$routeHeader}>{m.header}</route-header>

      <route-body style={$routeBody}>
        <route-content style={$routeContent}>
          {layout.desktop ? <Electrons side="left" width={layout.left} /> : undefined}
          {layout.desktop ? <Electrons side="right" width={layout.left} /> : undefined}

          <sections style={$sections}>
            <section style={$section}>
              <heading style={$heading}>{m.intro.heading}</heading>
              <paragraph style={$paragraph}>{m.intro.goal}</paragraph>
              <paragraph style={$paragraph}>{m.intro.approach}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.structure.heading}</heading>
              <paragraph style={$paragraph}>{m.structure.programs}</paragraph>
              <paragraph style={$paragraph}>{m.structure.polyrepo}</paragraph>
              <paragraph style={$paragraph}>{m.structure.monorepo}</paragraph>
              <paragraph style={$paragraph}>{m.structure.delegate}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.frontend.heading}</heading>
              <paragraph style={$paragraph}>{m.frontend.needs}</paragraph>
              <paragraph style={$paragraph}>{m.frontend.javascript}</paragraph>
              <paragraph style={$paragraph}>{m.frontend.flow}</paragraph>
              <paragraph style={$paragraph}>{m.frontend.typescript}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.framework.heading}</heading>
              <paragraph style={$paragraph}>{m.framework.needs}</paragraph>
              <paragraph style={$paragraph}>{m.framework.angular}</paragraph>
              <paragraph style={$paragraph}>{m.framework.vue}</paragraph>
              <paragraph style={$paragraph}>{m.framework.react}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.bundler.heading}</heading>
              <paragraph style={$paragraph}>{m.bundler.needs}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.deno}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.webpack}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.rolldown}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.vite}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.styles.heading}</heading>
              <paragraph style={$paragraph}>{m.styles.needs}</paragraph>
              <paragraph style={$paragraph}>{m.styles.scss}</paragraph>
              <paragraph style={$paragraph}>{m.styles.tailwind}</paragraph>
              <paragraph style={$paragraph}>{m.styles.emotion}</paragraph>
              <paragraph style={$paragraph}>{m.styles.inline}</paragraph>
              <paragraph style={$paragraph}>{m.styles.limits}</paragraph>
              <paragraph style={$paragraph}>{m.styles.tags}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.routing.heading}</heading>
              <paragraph style={$paragraph}>{m.routing.needs}</paragraph>
              <paragraph style={$paragraph}>{m.routing.reactRouter}</paragraph>
              <paragraph style={$paragraph}>{m.routing.tanstack}</paragraph>
              <paragraph style={$paragraph}>{m.routing.wouter}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.state.heading}</heading>
              <paragraph style={$paragraph}>{m.state.needs}</paragraph>
              <paragraph style={$paragraph}>{m.state.redux}</paragraph>
              <paragraph style={$paragraph}>{m.state.mobx}</paragraph>
              <paragraph style={$paragraph}>{m.state.zustand}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.backend.heading}</heading>
              <paragraph style={$paragraph}>{m.backend.needs}</paragraph>
              <paragraph style={$paragraph}>{m.backend.specialized}</paragraph>
              <paragraph style={$paragraph}>{m.backend.nodejs}</paragraph>
              <paragraph style={$paragraph}>{m.backend.bun}</paragraph>
              <paragraph style={$paragraph}>{m.backend.deno}</paragraph>
              <paragraph style={$paragraph}>{m.backend.minus}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.backendFramework.heading}</heading>
              <paragraph style={$paragraph}>{m.backendFramework.needs}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.express}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.fastify}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.oak}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.hono}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.database.heading}</heading>
              <paragraph style={$paragraph}>{m.database.needs}</paragraph>
              <paragraph style={$paragraph}>{m.database.mongodb}</paragraph>
              <paragraph style={$paragraph}>{m.database.postgresql}</paragraph>
              <paragraph style={$paragraph}>{m.database.orm}</paragraph>
              <paragraph style={$paragraph}>{m.database.migrations}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.os.heading}</heading>
              <paragraph style={$paragraph}>{m.os.needs}</paragraph>
              <paragraph style={$paragraph}>{m.os.windows}</paragraph>
              <paragraph style={$paragraph}>{m.os.linux}</paragraph>
              <paragraph style={$paragraph}>{m.os.freebsd}</paragraph>
              <paragraph style={$paragraph}>{m.os.minus}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.webserver.heading}</heading>
              <paragraph style={$paragraph}>{m.webserver.needs}</paragraph>
              <paragraph style={$paragraph}>{m.webserver.nginx}</paragraph>
              <paragraph style={$paragraph}>{m.webserver.caddy}</paragraph>
              <paragraph style={$paragraph}>{m.webserver.hono}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.api.heading}</heading>
              <paragraph style={$paragraph}>{m.api.needs}</paragraph>
              <paragraph style={$paragraph}>{m.api.graphql}</paragraph>
              <paragraph style={$paragraph}>{m.api.trpc}</paragraph>
              <paragraph style={$paragraph}>{m.api.rpc}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.tests.heading}</heading>
              <paragraph style={$paragraph}>{m.tests.e2e}</paragraph>
              <paragraph style={$paragraph}>{m.tests.cypress}</paragraph>
              <paragraph style={$paragraph}>{m.tests.playwright}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.lint.heading}</heading>
              <paragraph style={$paragraph}>{m.lint.needs}</paragraph>
              <paragraph style={$paragraph}>{m.lint.deno}</paragraph>
              <paragraph style={$paragraph}>{m.lint.eslint}</paragraph>
              <paragraph style={$paragraph}>{m.lint.biome}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.dates.heading}</heading>
              <paragraph style={$paragraph}>{m.dates.list}</paragraph>
              <paragraph style={$paragraph}>{m.dates.moment}</paragraph>
              <paragraph style={$paragraph}>{m.dates.dayjs}</paragraph>
              <paragraph style={$paragraph}>{m.dates.datefns}</paragraph>
              <paragraph style={$paragraph}>{m.dates.temporal}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.errors.heading}</heading>
              <paragraph style={$paragraph}>{m.errors.list}</paragraph>
              <paragraph style={$paragraph}>{m.errors.sentry}</paragraph>
              <paragraph style={$paragraph}>{m.errors.betterstack}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.translations.heading}</heading>
              <paragraph style={$paragraph}>{m.translations.list}</paragraph>
              <paragraph style={$paragraph}>{m.translations.i18next}</paragraph>
              <paragraph style={$paragraph}>{m.translations.reactIntl}</paragraph>
              <paragraph style={$paragraph}>{m.translations.intl}</paragraph>
              <paragraph style={$paragraph}>{m.translations.colocation}</paragraph>
              <paragraph style={$paragraph}>{m.translations.typing}</paragraph>
            </section>
          </sections>
        </route-content>
      </route-body>

      <Button
        name="register-button"
        type="ACCENT"
        left={layout.desktop ? layout.left + 60 : 30}
        bottom={layout.desktop ? 60 : 30}
        onClick={() => setModal("REGISTER")}
      >
        <span className="material-symbols-outlined">person_add</span>
        <Tooltip>{m.register}</Tooltip>
      </Button>

      <Button
        name="login-button"
        type="ACCENT"
        right={layout.desktop ? layout.left + 60 : 30}
        bottom={layout.desktop ? 60 : 30}
        onClick={() => setModal("LOGIN")}
      >
        <span className="material-symbols-outlined">door_back</span>
        <Tooltip>{m.login}</Tooltip>
      </Button>

      {modal === "LOGIN" ? <LoginModal onClose={() => setModal("NONE")} /> : undefined}
      {modal === "REGISTER" ? <RegisterModal onClose={() => setModal("NONE")} /> : undefined}
    </route>
  );
}

const m = translate({
  header: ["Contacts Manager", "Менеджер Контактов"],
  register: ["Register", "Регистрация"],
  login: ["Login", "Вход"],
  intro: {
    heading: ["Introduction", "Вступление"],
    goal: [
      "The goal of the project is to show how I write code, so the business logic is intentionally simple. Users register and keep a list of contacts. Contacts can be created, edited and deleted. Each contact has a name, email and comment. The main criterion for choosing technologies is simplicity and minimalism, and each section below has the requirements, the options and the choice.",
      "Цель проекта - показать, как я пишу код, поэтому бизнес-логика намеренно простая. Пользователи регистрируются и ведут список контактов. Контакты можно создавать, редактировать и удалять. В каждом контакте есть имя, почта и комментарий. Главный критерий выбора технологий - простота и минимализм, и в каждом разделе ниже есть требования, варианты и выбор."
    ],
    approach: [
      'Stack - <term>React</term>, <term>Deno</term>, <term>Hono</term>, <term>PostgreSQL</term>, <term>FreeBSD</term>. I wrote the architecture and code myself. AI was used only for learning and proofreading. The source code is available on GitHub: <a href="https://github.com/mnemonick/contacts-manager" target="_blank">github.com/mnemonick/contacts-manager</a>.',
      'Стек - <term>React</term>, <term>Deno</term>, <term>Hono</term>, <term>PostgreSQL</term>, <term>FreeBSD</term>. Архитектура и код - мои. ИИ использовался только для обучения и пруф-ридинга. Исходный код доступен на GitHub: <a href="https://github.com/mnemonick/contacts-manager" target="_blank">github.com/mnemonick/contacts-manager</a>.'
    ]
  },
  structure: {
    heading: ["Structure", "Структура"],
    programs: [
      "Almost any modern application consists of several programs: <term>Backend</term>, <term>Frontend</term>, <term>WebServer</term>, <term>Tests</term>. <term>Backend</term> and <term>Frontend</term> can be split further into smaller parts (which are called microservices and micro-frontends). These programs can be grouped into repositories in two ways.",
      "Почти любое современное приложение состоит из нескольких программ: <term>Backend</term>, <term>Frontend</term>, <term>WebServer</term>, <term>Tests</term>. <term>Backend</term> и <term>Frontend</term> можно и дальше дробить на более мелкие части (которые называют микросервисами и микрофронтендами). Эти программы можно группировать по репозиториям двумя способами."
    ],
    polyrepo: [
      "<term>PolyRepo</term> - a separate repository for each program. The advantage of this approach is that programs can be developed in isolation. But in practice the logic of <term>Frontend</term> and <term>Backend</term> is tightly intertwined, and it is much more convenient to develop them as a single whole.",
      "<term>PolyRepo</term> - отдельный репозиторий на каждую программу. Плюс этого подхода в том, что программы можно разрабатывать изолированно. Но на практике логика <term>Frontend</term> и <term>Backend</term> тесно переплетена, и их намного удобнее разрабатывать как единое целое."
    ],
    monorepo: [
      "<term>MonoRepo</term> - all programs in one repository. In practice this greatly simplifies development and deployment, and AI tools also see the whole project at once.",
      "<term>MonoRepo</term> - все программы в одном репозитории. На практике это сильно упрощает разработку и деплой, к тому же ИИ-инструменты видят сразу весь проект."
    ],
    delegate: [
      "I prefer the approach where one developer does a whole task - both the <term>Frontend</term> and the <term>Backend</term>. With the <term>MonoRepo</term> approach this is easier to organize, so in the end I settled on it.",
      "Я сторонник подхода, при котором одну задачу целиком делает один разработчик - и <term>Frontend</term>, и <term>Backend</term>. При использовании <term>MonoRepo</term> подхода это организовать проще, поэтому в итоге остановился на нем."
    ]
  },
  frontend: {
    heading: ["Frontend language", "Frontend язык"],
    needs: [
      "From a <term>Frontend</term> language I need static typing and a mature ecosystem - libraries, editors, tools.",
      "От <term>Frontend</term> языка мне нужны статическая типизация и развитая экосистема - библиотеки, редакторы, инструменты."
    ],
    javascript: [
      "<term>JavaScript</term> - works without a build step, but it has no types, and type errors show up only at runtime. I prefer static typing.",
      "<term>JavaScript</term> - работает без сборки, но в нем нет типов, и ошибки типов видны только в рантайме. Я предпочитаю статическую типизацию."
    ],
    flow: [
      "<term>Flow</term> - a type checker from <term>Meta</term> that has long fallen behind <term>TypeScript</term>.",
      "<term>Flow</term> - анализатор типов от <term>Meta</term>, который давно отстал от <term>TypeScript</term>."
    ],
    typescript: [
      "<term>TypeScript</term> - the de facto standard. <term>Deno</term> and <term>Vite</term> work with it without configuration. One language is used for the <term>Frontend</term>, the <term>Backend</term>, the web server and the tests, so the whole project is written with the same tools. The choice here was obvious.",
      "<term>TypeScript</term> - стандарт де-факто. <term>Deno</term> и <term>Vite</term> работают с ним без настройки. Один язык используется на <term>Frontend</term>, <term>Backend</term>, в веб-сервере и тестах, поэтому весь проект пишется одними инструментами. Тут выбор был очевиден."
    ]
  },
  framework: {
    heading: ["Frontend framework", "Frontend фреймворк"],
    needs: [
      "My requirements for a <term>Frontend</term> framework: a component in one file, markup in <term>TypeScript</term> (<term>JSX</term>) with type checking, a large ecosystem. I considered the following options:",
      "Мои требования к <term>Frontend</term> фреймворку: компонент в одном файле, разметка на <term>TypeScript</term> (<term>JSX</term>) с проверкой типов, большая экосистема. Рассматривал следующие варианты:"
    ],
    angular: [
      "<term>Angular</term> - by default a component is split into three files: a class, an <term>HTML</term> template and styles. I prefer one file. Templates also have their own syntax. All technologies are built into the framework, so you do not need to assemble them, but you lose low-level control.",
      "<term>Angular</term> - по умолчанию компонент разделен на три файла: класс, <term>HTML</term>-шаблон и стили. Я предпочитаю один файл. А еще у шаблонов свой синтаксис. Все технологии встроены в фреймворк, поэтому их не нужно собирать по частям, но теряется низкоуровневый контроль."
    ],
    vue: [
      "<term>Vue</term> - a component is written in one <term>.vue</term> file. But templates have their own language (<term>v-if</term>, <term>v-for</term>), and this file format needs a separate compiler.",
      "<term>Vue</term> - компонент пишется в одном файле <term>.vue</term>. Но у шаблонов свой язык (<term>v-if</term>, <term>v-for</term>), а для этого формата файлов нужен отдельный компилятор."
    ],
    react: [
      "In <term>React</term> a component is a regular <term>TypeScript</term> function with <term>JSX</term>, without a separate template language. The API is small - components and hooks. I settled on <term>React</term> - it meets all the requirements, and its ecosystem is the largest.",
      "В <term>React</term> компонент - это обычная функция на <term>TypeScript</term> с <term>JSX</term>, без своего языка шаблонов. API маленький - компоненты и хуки. Остановился на <term>React</term> - он подходит под все требования, а экосистема у него самая большая."
    ]
  },
  bundler: {
    heading: ["Bundler", "Бандлер"],
    needs: [
      "My requirements for a bundler - <term>TypeScript</term> integration, minification, <term>SourceMap</term> support.",
      "Мои требования к бандлеру - интеграция с <term>TypeScript</term>, минификация, поддержка <term>SourceMap</term>."
    ],
    deno: [
      "<term>deno bundle</term> - built into <term>Deno</term>. It is the most minimalistic option, but it is not functional enough.",
      "<term>deno bundle</term> - встроен в <term>Deno</term>. Это самый минималистичный вариант, но он недостаточно функциональный."
    ],
    webpack: [
      "<term>Webpack</term> - used to be very popular. But it needs a separate loader for <term>TypeScript</term>. Its config is several times longer, and it is written in <term>JavaScript</term>, so it is slower.",
      "<term>Webpack</term> - раньше был очень популярен. Но для <term>TypeScript</term> ему нужен отдельный лоадер. Конфиг у него в разы длиннее, а еще он написан на <term>JavaScript</term>, поэтому медленнее."
    ],
    rolldown: [
      "<term>Rolldown</term> - a bundler in <term>Rust</term>. It is compatible with <term>Rollup</term>. Since version 8, <term>Vite</term> runs on top of it.",
      "<term>Rolldown</term> - бандлер на <term>Rust</term>. Он совместим с <term>Rollup</term>. С 8 версии <term>Vite</term> работает поверх него."
    ],
    vite: [
      "<term>Vite</term> - the same <term>Rolldown</term>, but with ready-made settings for <term>TypeScript</term>, minification and <term>SourceMap</term>. In the end I took <term>Vite</term>. It does everything I need, and its config is the most concise.",
      "<term>Vite</term> - это тот же <term>Rolldown</term>, но с готовыми настройками для <term>TypeScript</term>, минификации и <term>SourceMap</term>. В итоге я взял <term>Vite</term>. Он делает все, что мне нужно, и конфиг у него самый лаконичный."
    ]
  },
  styles: {
    heading: ["Styles", "Стили"],
    needs: [
      "I want to keep styles in the same file as the component, typed and without third-party libraries.",
      "Стили я хочу держать в одном файле с компонентом, с типизацией и без сторонних библиотек."
    ],
    scss: [
      "<term>SCSS</term> - used to be very popular. Its main feature is nested selectors, but <term>CSS</term> now supports them natively. Styles also live in a separate file. I do not like that.",
      "<term>SCSS</term> - раньше был очень популярен. Его главная фича - вложенные селекторы, но теперь они есть в <term>CSS</term> нативно. Еще стили лежат в отдельном файле. Мне это не нравится."
    ],
    tailwind: [
      "<term>Tailwind</term> - the most popular approach now. But it has its own class language and a separate build step, and long strings of classes are hard to read.",
      "<term>Tailwind</term> - самый популярный подход сейчас. Но у него свой язык классов и отдельная сборка, а длинные строки классов плохо читаются."
    ],
    emotion: [
      "<term>Emotion</term> - the most popular <term>CSS-in-JS</term> library. Styles are written inside the component. But it is a third-party library with a runtime, and the same can be done without it.",
      "<term>Emotion</term> - самая популярная библиотека <term>CSS-in-JS</term>. В ней стили пишутся внутри компонента, но то же самое можно сделать без нее."
    ],
    inline: [
      "<term>Inline</term> - styles are written directly on elements. <term>CSSProperties</term> gives them types. Styles can reference each other's properties, for example the page body height is calculated from <term>$routeHeader.height</term>.",
      "<term>Inline</term> - стили пишутся прямо на элементах. Типы дает <term>CSSProperties</term>. Стили могут ссылаться на свойства друг друга."
    ],
    limits: [
      "Inline styles have no <term>:hover</term>, <term>@media</term>, <term>@keyframes</term> or pseudo-elements. Responsiveness is done with the <term>useLayout</term> hook. Hover is done with event handlers. Animations and the scrollbar are described in one global <term>Styles</term> component. In practice this is enough, so I settled on inline styles.",
      "У inline-стилей нет <term>:hover</term>, <term>@media</term>, <term>@keyframes</term> и псевдоэлементов. Адаптивность я делаю через хук <term>useLayout</term>. Hover - через обработчики событий. Анимации и скроллбар описаны в одном глобальном компоненте <term>Styles</term>. На практике этого хватает, поэтому остановился на inline-стилях."
    ],
    tags: [
      "Instead of <term>div</term> I use custom tags. The tag name is the role of the layer: <term>section</term>, <term>heading</term>, <term>paragraph</term>. The code shows right away what each layer does, and <term>E2E</term> tests find layers by tag name.",
      "Вместо <term>div</term> я использую кастомные теги. Имя тега - это роль слоя: <term>section</term>, <term>heading</term>, <term>paragraph</term>. По коду сразу видно, что делает каждый слой, а <term>E2E</term>-тесты находят слои по имени тега."
    ]
  },
  routing: {
    heading: ["Routing", "Роутинг"],
    needs: [
      "I need little from a router: show a component by <term>URL</term>, a 404 page for unknown paths, and redirects from code. I do not need <term>SSR</term>, data loaders, nested layouts, typed parameters or file-based routing.",
      "От роутера мне нужно немного - показывать компонент по <term>URL</term>, страницу 404 для неизвестных путей и редирект из кода. <term>SSR</term>, загрузчики данных, вложенные лейауты, типизированные параметры и роутинг по файлам мне не нужны."
    ],
    reactRouter: [
      "<term>React Router</term> - merged with <term>Remix</term> in version 7 and became a framework with loaders, actions and <term>SSR</term>. I do not need most of it.",
      "<term>React Router</term> - с 7 версии объединен с <term>Remix</term> и стал фреймворком с загрузчиками, экшенами и <term>SSR</term>. Большая часть этого мне не нужна."
    ],
    tanstack: [
      "<term>TanStack Router</term> - strong typing of paths and parameters. But it needs code generation or file-based routing. Its API is also much larger.",
      "<term>TanStack Router</term> - сильная типизация путей и параметров. Но ему нужна кодогенерация или роутинг по файлам. И API у него намного больше."
    ],
    wouter: [
      "<term>Wouter</term> - only routes and navigation. Nothing extra. It does exactly what I need, so I took it.",
      "<term>Wouter</term> - только роуты и навигация. Ничего лишнего. Он делает ровно то, что нужно, поэтому его и взял."
    ]
  },
  state: {
    heading: ["State management", "Управление состоянием"],
    needs: [
      "For state I need the most concise library possible.",
      "Для состояния нужна максимально лаконичная библиотека."
    ],
    redux: [
      "<term>Redux</term> - even with <term>Redux Toolkit</term> it needs slices, a <term>Provider</term> and dispatching actions. That is too much boilerplate.",
      "<term>Redux</term> - даже с <term>Redux Toolkit</term> нужны слайсы, <term>Provider</term> и диспатч экшенов. Это слишком много бойлерплейта."
    ],
    mobx: [
      "<term>MobX</term> - reactivity through observable objects. Components have to be wrapped in <term>observer</term>. It is a different mental model based on proxy magic, and it fits <term>React</term> hooks worse.",
      "<term>MobX</term> - реактивность через observable-объекты. Компоненты нужно оборачивать в <term>observer</term>. Это другая модель мышления, в ее основе магия прокси, и она хуже сочетается с хуками <term>React</term>."
    ],
    zustand: [
      "<term>Zustand</term> - a store is created with one <term>create</term> call, and components use it as a regular hook. It is the simplest option of all. I settled on it.",
      "<term>Zustand</term> - стор создается одним вызовом <term>create</term>, а в компонентах он используется как обычный хук. Это самый простой вариант из всех. На нем и остановился."
    ]
  },
  backend: {
    heading: ["Backend language", "Backend язык"],
    needs: [
      "My requirements for the <term>Backend</term> - simplicity and minimalism, and ideally the same tools as on the <term>Frontend</term>. I considered the following options:",
      "Мои требования к - простота и минимализм, а в идеале - те же инструменты, что и на <term>Frontend</term>. Рассматривал следующие варианты:"
    ],
    specialized: [
      "<term>Go</term> and <term>Rust</term> - languages for the backend. They are faster and use less memory. But language performance is generally not a bottleneck, and <term>Frontend</term> and <term>Backend</term> would need completely different tools.",
      "<term>Go</term> и <term>Rust</term> - языки для бэкенда. Они быстрее и экономнее по памяти. Но производительность языка в целом не узкое место, а <term>Frontend</term> и <term>Backend</term> тогда пришлось бы разрабатывать совершенно разными инструментами."
    ],
    nodejs: [
      "<term>Node.js</term> - <term>JavaScript</term> on the server. To be honest, <term>JavaScript</term> is not the best language, and <term>TypeScript</term> only partially solves this problem. But <term>Frontend</term> and <term>Backend</term> use the same tools.",
      "<term>Node.js</term> - это <term>JavaScript</term> на сервере. Честно говоря, <term>JavaScript</term> - не самый лучший язык, и <term>TypeScript</term> только частично решает эту проблему. Зато <term>Frontend</term> и <term>Backend</term> разрабатываются одними инструментами."
    ],
    bun: [
      "<term>Bun</term> - a fast runtime compatible with <term>Node.js</term>, but without a permission system.",
      "<term>Bun</term> - быстрый рантайм, он совместим с <term>Node.js</term>, но системы разрешений в нем нет."
    ],
    deno: [
      "<term>Deno</term> - a separate runtime by the author of <term>Node.js</term>. It is written from scratch in <term>Rust</term>. Its main advantage is a more intuitive standard library: the main methods are on the global <term>Deno</term> object, and everything else is in <term>@std</term>. It runs <term>TypeScript</term> without a build step. It checks types itself (<term>deno check</term>). It also supports workspaces and permission sets (<term>--permission-set</term>).",
      "<term>Deno</term> - отдельный рантайм от автора <term>Node.js</term>. Он написан с нуля на <term>Rust</term>. Главный плюс - более интуитивная стандартная библиотека: основные методы находятся в глобальном объекте <term>Deno</term>, а все остальное вынесено в <term>@std</term>. Он запускает <term>TypeScript</term> без сборки. Типы он проверяет сам (<term>deno check</term>). Еще он поддерживает workspace и наборы разрешений (<term>--permission-set</term>)."
    ],
    minus: [
      "The downside: <term>deno compile</term> has no <term>FreeBSD</term> target, so on the server the programs are started with <term>deno run</term>. Otherwise <term>Deno</term> is the most minimalistic way to use the same tools everywhere. So I chose it.",
      "Минус: у <term>deno compile</term> нет сборки под <term>FreeBSD</term>, поэтому на сервере программы запускаются через <term>deno run</term>. В остальном <term>Deno</term> - самый минималистичный способ писать все одними инструментами. Поэтому выбрал его."
    ]
  },
  backendFramework: {
    heading: ["Backend framework", "Backend фреймворк"],
    needs: [
      "From a backend framework I need routing, ready-made middleware, and typed requests and responses.",
      "От Backend фреймворка мне нужны роутинг, готовые middleware и типизация запросов и ответов."
    ],
    express: [
      "<term>Express</term> - the most popular one. But it is made for <term>Node.js</term>, its types come as a separate package, and it has no typed client.",
      "<term>Express</term> - самый популярный. Но он сделан под <term>Node.js</term>, типы для него идут отдельным пакетом, и у него нет типизированного клиента."
    ],
    fastify: [
      "<term>Fastify</term> - faster than <term>Express</term>. But it is also made for <term>Node.js</term>. It is built around its own plugins and schemas.",
      "<term>Fastify</term> - быстрее <term>Express</term>. Но он тоже сделан под <term>Node.js</term>. И он построен вокруг своих плагинов и схем."
    ],
    oak: [
      "<term>Oak</term> - made for <term>Deno</term>, but without a typed client.",
      "<term>Oak</term> - сделан под <term>Deno</term>, но типизированного клиента у него нет."
    ],
    hono: [
      "<term>Hono</term> - built on web standards (<term>Request</term>, <term>Response</term>), so it works in <term>Deno</term> without adapters. It has ready-made middleware: <term>cors</term>, <term>bodyLimit</term>, <term>timeout</term>, <term>secureHeaders</term>. It also has a typed client. The <term>Frontend</term> calls the <term>Backend</term> with types from the handlers. <term>Hono</term> covers all the requirements, so I chose it.",
      "<term>Hono</term> - построен на веб-стандартах (<term>Request</term>, <term>Response</term>), поэтому он работает в <term>Deno</term> без адаптеров. У него есть готовые middleware: <term>cors</term>, <term>bodyLimit</term>, <term>timeout</term>, <term>secureHeaders</term>. Еще у него есть типизированный клиент. <term>Frontend</term> вызывает <term>Backend</term> с типами из хендлеров. <term>Hono</term> закрывает все требования, поэтому выбрал его."
    ]
  },
  database: {
    heading: ["Database", "База данных"],
    needs: [
      "My requirements for a database: strict typing, so the tool warns me if I am doing something wrong. I considered the following options:",
      "Мои требования к базе данных: строгая типизация, чтобы инструмент подсказывал, если я делаю что-то не так. Рассматривал следующие варианты:"
    ],
    mongodb: [
      "<term>MongoDB</term> - <term>JavaScript</term> integrates better with its <term>JSON</term> structures. But it has no strict typing.",
      "<term>MongoDB</term> - <term>JavaScript</term> лучше интегрируется с ее <term>JSON</term>-структурами. Но в ней нет строгой типизации."
    ],
    postgresql: [
      "<term>PostgreSQL</term> - a relational database with strict typing. The choice here was simple.",
      "<term>PostgreSQL</term> - реляционная база данных со строгой типизацией. Здесь выбор был простой."
    ],
    orm: [
      "Instead of an <term>ORM</term> (for example <term>Prisma</term> or <term>Drizzle</term>) I use the <term>postgres</term> module. Queries are written in plain <term>SQL</term>. Parameters go to the database separately from the query text, so <term>SQL</term> injections are impossible. I prefer low-level control over queries. The downside is that result types are not inferred from the schema and have to be specified manually.",
      "Вместо <term>ORM</term> (например, <term>Prisma</term> или <term>Drizzle</term>) я использую модуль <term>postgres</term>. Запросы пишутся на чистом <term>SQL</term>. Параметры передаются в базу отдельно от текста запроса, поэтому <term>SQL</term>-инъекции невозможны. Я предпочитаю низкоуровневый контроль над запросами. Минус в том, что типы результатов не выводятся из схемы, и их приходится указывать вручную."
    ],
    migrations: [
      "Migrations are applied by the <term>postgres-shift</term> library from the author of the <term>postgres</term> module. Migrations are plain <term>SQL</term> files. All new ones run in one transaction when the <term>Backend</term> starts. If one fails, none are applied.",
      "Миграции применяет библиотека <term>postgres-shift</term> от автора модуля <term>postgres</term>. Миграции - это обычные <term>SQL</term>-файлы. Все новые выполняются в одной транзакции при запуске <term>Backend</term>. Если одна упадет, не применится ни одна."
    ]
  },
  os: {
    heading: ["Operating system", "Операционная система"],
    needs: [
      "From a server operating system I need minimalism and simple administration.",
      "От серверной операционной системы мне нужны минимализм и простота администрирования."
    ],
    windows: [
      "<term>Windows</term> - rare on servers: an expensive license and a lot of unnecessary things.",
      "<term>Windows</term> - редко встречается на серверах: дорогая лицензия и много лишнего."
    ],
    linux: [
      "<term>Linux</term> - the de facto standard for servers. But it is only a kernel. A distribution (for example <term>Ubuntu</term>) assembles the whole operating system from many independent projects.",
      "<term>Linux</term> - стандарт де-факто для серверов. Но это только ядро. Операционную систему целиком собирает дистрибутив (например, <term>Ubuntu</term>) из множества независимых проектов."
    ],
    freebsd: [
      "<term>FreeBSD</term> - a more minimalistic alternative to <term>Linux</term>. It is a complete operating system. One team develops the kernel and the base system in one repository, and everything is described in one <term>Handbook</term>. The base system has ~250 binaries versus ~800 in <term>Ubuntu</term>. Packages are installed via <term>pkg</term>.",
      "<term>FreeBSD</term> - более минималистичная альтернатива <term>Linux</term>. Это цельная операционная система, не нужно выбрать дистрибутив. Ядро и базовую систему разрабатывает одна команда в одном репозитории, и все описано в одном <term>Handbook</term>. В базовой системе ~250 бинарников против ~800 в <term>Ubuntu</term>. Пакеты ставятся через <term>pkg</term>."
    ],
    minus: [
      "The main downside of <term>FreeBSD</term> is no <term>Docker</term> support. It has built-in <term>jails</term> instead. This project does not need containers anyway, because deployment is one <term>deploy.sh</term> script. Some tools also do not support <term>FreeBSD</term>, for example <term>deno compile</term>. Still, the advantages outweigh this, so I went with <term>FreeBSD</term>.",
      "Главный минус <term>FreeBSD</term> - нет поддержки <term>Docker</term>. Вместо него есть встроенные <term>jails</term>. В этом проекте контейнеры и не нужны, потому что деплой - это один скрипт <term>deploy.sh</term>. Еще <term>FreeBSD</term> не поддерживают некоторые инструменты, например <term>deno compile</term>. Но плюсы все равно перевешивают, поэтому выбрал <term>FreeBSD</term>."
    ]
  },
  webserver: {
    heading: ["Web server", "Веб-сервер"],
    needs: [
      "By and large, the web server's job is just to return <term>index.html</term> for client-side routes and set headers.",
      "По большому счету задача веб-сервер это просто отдавать <term>index.html</term> для клиентских роутов и проставлять заголовки."
    ],
    nginx: [
      "<term>Nginx</term> - the industry standard. But it is a separate program with its own configuration language (<term>DSL</term>), and it has to be installed and configured separately from the project.",
      "<term>Nginx</term> - стандарт индустрии. Но это отдельная программа со своим языком конфигурации (<term>DSL</term>), и ее нужно ставить и настраивать отдельно от проекта."
    ],
    caddy: [
      "<term>Caddy</term> - a more modern alternative to <term>Nginx</term>. It obtains and renews <term>HTTPS</term> certificates by itself. But it is also a separate tool with its own <term>DSL</term> (<term>Caddyfile</term>).",
      "<term>Caddy</term> - более современная альтернатива <term>Nginx</term>. Она сама получает и продлевает <term>HTTPS</term>-сертификаты. Но это тоже отдельный инструмент со своим <term>DSL</term> (<term>Caddyfile</term>)."
    ],
    hono: [
      "My own web server on <term>Hono</term> - the <term>Backend</term> already runs on <term>Hono</term>, so no new tool was needed. It is about 100 lines of <term>TypeScript</term>. The logic is in a regular language, not in a <term>DSL</term>. So in the end I did without a separate web server.",
      "Свой веб-сервер на <term>Hono</term> - на <term>Hono</term> уже работает <term>Backend</term>, поэтому новый инструмент не понадобился. Это около 100 строк на <term>TypeScript</term>. Логика описана на обычном языке, а не на <term>DSL</term>. Так что в итоге обошелся без отдельного веб-сервера."
    ]
  },
  api: {
    heading: ["API", "API"],
    needs: [
      "My requirements for the <term>API</term> - typing between <term>Frontend</term> and <term>Backend</term> without code generation and extra libraries. I considered the following options:",
      "Мне необходимо типизировать сообщения между <term>Frontend</term> и <term>Backend</term> без кодогенерации и лишних библиотек. Рассматривал следующие варианты:"
    ],
    graphql: [
      "<term>GraphQL</term> - the client chooses the fields it needs. All requests go through one endpoint. But this needs a schema, resolvers and a client library, which is clear overkill for five endpoints.",
      "<term>GraphQL</term> - клиент сам выбирает нужные поля. Все запросы идут через один эндпоинт. Но для этого нужны схема, резолверы и клиентская библиотека, а для пяти эндпоинтов это явный перебор."
    ],
    trpc: [
      "<term>tRPC</term> - typed <term>RPC</term> between <term>Frontend</term> and <term>Backend</term>. But it is a separate library with its own routers.",
      "<term>tRPC</term> - типизированный <term>RPC</term> между <term>Frontend</term> и <term>Backend</term>. Но это отдельная библиотека со своими роутерами."
    ],
    rpc: [
      "<term>RPC</term> over <term>HTTP</term> on <term>Hono</term> - this is not classic <term>REST</term>, because endpoints are named with verbs (<term>/get-user</term>, <term>/create-contact</term>), not resources. The <term>API</term> is typed via the <term>Hono</term> client. I settled on this option. The typing is the same as in <term>tRPC</term>.",
      "<term>RPC</term> поверх <term>HTTP</term> на <term>Hono</term> - это не классический <term>REST</term>, потому что эндпоинты названы глаголами (<term>/get-user</term>, <term>/create-contact</term>), а не ресурсами. <term>API</term> типизируется через клиент <term>Hono</term>. На этом варианте и остановился. Типизация та же, что у <term>tRPC</term>."
    ]
  },
  tests: {
    heading: ["Tests", "Тесты"],
    e2e: [
      "I am a proponent of <term>E2E</term> testing. Such a test checks what the user sees. It does not depend on the implementation. So it does not break during refactoring. Unit and integration tests catch far fewer bugs, so I gave them up.",
      "Я сторонник <term>E2E</term>-тестирования. Такой тест проверяет то, что видит пользователь. Он не зависит от реализации. Поэтому он не ломается при рефакторинге. Unit и интеграционные тесты ловят намного меньше багов, поэтому я от них отказался."
    ],
    cypress: [
      "<term>Cypress</term> - tests run inside the browser, so working with several tabs and domains is harder. Some features are paid.",
      "<term>Cypress</term> - тесты выполняются внутри браузера, поэтому сложнее работать с несколькими вкладками и доменами. Часть функций платная."
    ],
    playwright: [
      "<term>Playwright</term> - waits for elements by itself. It has a built-in test runner and one API for <term>Chromium</term>, <term>Firefox</term> and <term>WebKit</term>. That is the one I chose.",
      "<term>Playwright</term> - сам ждет появления элементов. У него есть встроенный тест-раннер и один API для <term>Chromium</term>, <term>Firefox</term> и <term>WebKit</term>. Его я и выбрал."
    ]
  },
  lint: {
    heading: ["Linting", "Линтинг"],
    needs: [
      "My requirements for a linter - linting and formatting in one tool, flexible rule configuration. I considered the following options:",
      "Мои требования к линтеру - линтинг и форматирование в одном инструменте, гибкая настройка правил. Рассматривал следующие варианты:"
    ],
    deno: [
      "<term>Deno</term> (<term>deno lint</term> and <term>deno fmt</term>) - already used in the project. But it has far fewer rules.",
      "<term>Deno</term> (<term>deno lint</term> и <term>deno fmt</term>) - уже используется в проекте. Но правил в нем намного меньше."
    ],
    eslint: [
      "<term>ESLint</term> - needs plugins for <term>TypeScript</term> and <term>React</term>, and formatting needs a separate <term>Prettier</term>. That makes two tools instead of one.",
      "<term>ESLint</term> - для <term>TypeScript</term> и <term>React</term> ему нужны плагины, а для форматирования нужен отдельный <term>Prettier</term>. Получается два инструмента вместо одного."
    ],
    biome: [
      "<term>Biome</term> - a linter and formatter in one tool, with one config and no plugins. It is written in <term>Rust</term>. It is many times faster. In the end I took <term>Biome</term>.",
      "<term>Biome</term> - линтер и форматтер в одном инструменте, с одним конфигом и без плагинов. Он написан на <term>Rust</term>. Работает в разы быстрее. В итоге взял <term>Biome</term>."
    ]
  },
  dates: {
    heading: ["Dates", "Даты"],
    list: [
      "For working with dates I considered the following options:",
      "Для работы с датами рассматривал следующие варианты:"
    ],
    moment: [
      "<term>Moment</term> - its authors have considered it legacy since 2020. It is only in maintenance mode. It is also mutable and heavy, especially with locales.",
      "<term>Moment</term> - с 2020 года авторы считают его устаревшим. Он только в режиме поддержки. К тому же он изменяемый и тяжелый, особенно с локалями."
    ],
    dayjs: [
      "<term>Day.js</term> - small, with an API like <term>Moment</term>. But it is still a dependency, and time zones need a plugin.",
      "<term>Day.js</term> - маленький, с API как у <term>Moment</term>. Но это все равно зависимость, а часовые пояса подключаются плагином."
    ],
    datefns: [
      "<term>date-fns</term> - the most popular modern library. But it is an extra dependency when <term>Temporal</term> is built in.",
      "<term>date-fns</term> - самая популярная современная библиотека. Но это лишняя зависимость, когда есть встроенный <term>Temporal</term>."
    ],
    temporal: [
      "<term>Temporal</term> - a built-in standard without dependencies. It is available in <term>Deno</term> and in browsers. The downside is that it is new, and <term>Safari</term> does not support it yet, so it needs a polyfill there. But it is the future standard, so I chose it.",
      "<term>Temporal</term> - встроенный стандарт без зависимостей. Он есть в <term>Deno</term> и в браузерах. Минус в том, что это новый стандарт, и в <term>Safari</term> его пока нет, поэтому там нужен полифилл. Но это будущий стандарт, поэтому выбрал его."
    ]
  },
  errors: {
    heading: ["Error tracking", "Перехват ошибок"],
    list: ["I considered the following options:", "Рассматривал следующие варианты:"],
    sentry: [
      "<term>Sentry</term> - the most popular error tracking service. But its interface is overloaded, and it has too many features.",
      "<term>Sentry</term> - самый популярный сервис для перехвата ошибок. Но интерфейс у него перегружен, а функций слишком много."
    ],
    betterstack: [
      "<term>Better Stack</term> - compatible with the <term>Sentry</term> SDK, so the official <term>Sentry</term> libraries send the errors. Errors are caught only in production. This works on both the <term>Frontend</term> and the <term>Backend</term>. I chose <term>Better Stack</term> - it is more minimalistic.",
      "<term>Better Stack</term> - совместим с SDK <term>Sentry</term>, поэтому ошибки отправляют официальные библиотеки <term>Sentry</term>. Ошибки перехватываются только в продакшене. Это работает и на <term>Frontend</term>, и на <term>Backend</term>. Выбрал <term>Better Stack</term> - он минималистичнее."
    ]
  },
  translations: {
    heading: ["Internationalization", "Интернационализация"],
    list: ["I considered the following options:", "Рассматривал следующие варианты:"],
    i18next: [
      "<term>i18next</term> - the most popular library. But translations are stored in <term>JSON</term> files separately from components, and it also needs initialization and plugins.",
      "<term>i18next</term> - самая популярная библиотека. Но переводы хранятся в <term>JSON</term>-файлах отдельно от компонентов, а еще нужны инициализация и плагины."
    ],
    reactIntl: [
      "<term>react-intl</term> - also separate translation files. A typo in a key is only detected at runtime.",
      "<term>react-intl</term> - тоже отдельные файлы переводов. Опечатка в ключе обнаруживается только в рантайме."
    ],
    intl: [
      "My own solution - about 60 lines of code without dependencies.",
      "Свое решение - около 60 строк кода без зависимостей."
    ],
    colocation: [
      "Translations are stored at the bottom of the component file. The English and Russian versions of a string sit side by side. I prefer everything related to a component to be in one file, not spread across several.",
      "Переводы хранятся внизу файла компонента. Английская и русская версии строки лежат рядом. Я предпочитаю, когда все, что относится к компоненту, лежит в одном файле, а не размазано по нескольким."
    ],
    typing: [
      "Translation keys are checked at compile time. A typo in a key is a type error. In the end, my own solution turned out simpler than the libraries: translations are next to the component, and keys are checked without extra dependencies.",
      "Ключи переводов проверяются на этапе компиляции. Опечатка в ключе - это ошибка типов. В итоге свое решение оказалось проще библиотек: переводы лежат рядом с компонентом, а ключи проверяются без лишних зависимостей."
    ]
  }
});
