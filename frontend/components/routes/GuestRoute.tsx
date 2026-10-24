import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  const bodyRef = useRef<HTMLElement>(null);

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
    width: layout.width,
    position: "relative",
    left: layout.left,
    paddingLeft: layout.desktop ? 20 : 10,
    paddingRight: layout.desktop ? 20 : 10,
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
    borderBottom: `1px dashed ${colors.border.strong}`
  };

  const $section: CSSProperties = {
    borderTop: `1px solid ${colors.border.strong}`,
    borderRight: `1px solid ${colors.border.strong}`,
    borderBottom: `1px solid ${colors.border.strong}`,
    borderLeft: `1px solid ${colors.border.strong}`,
    borderRadius: 10,
    marginTop: layout.desktop ? 40 : 10,
    marginBottom: layout.desktop ? 40 : 10,
    background: colors.section,
    lineHeight: "21px",
    fontFamily: "Montserrat"
  };

  const $paragraph: CSSProperties = {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: layout.desktop ? 20 : 10,
    marginRight: layout.desktop ? 20 : 10
  };

  useEffect(() => {
    const credentials = localStorage.username && localStorage.password;

    if (credentials) {
      setLocation("/user");
    }
  });

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const sections = body.querySelectorAll<HTMLElement>("section");

    function reveal(section: HTMLElement) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0) scale(1)";
    }

    if (typeof IntersectionObserver === "undefined") {
      sections.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      layout.mobile
        ? { threshold: 0, rootMargin: "0px 0px 50% 0px" }
        : { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    for (const section of sections) observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [layout.mobile]);

  return (
    <route style={$route}>
      <route-header style={$routeHeader}>{m.header}</route-header>
      <route-body ref={bodyRef} style={$routeBody}>
        <route-content style={$routeContent}>
          {layout.desktop ? <Electrons side="left" width={layout.left} /> : null}
          {layout.desktop ? <Electrons side="right" width={layout.left} /> : null}

          <sections style={$sections}>
            <section style={$section}>
              <heading style={$heading}>{m.intro.heading}</heading>
              <paragraph style={$paragraph}>{m.intro.goal}</paragraph>
              <paragraph style={$paragraph}>{m.intro.criterion}</paragraph>
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
              <paragraph style={$paragraph}>{m.framework.choice}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.bundler.heading}</heading>
              <paragraph style={$paragraph}>{m.bundler.needs}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.webpack}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.rolldown}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.vite}</paragraph>
              <paragraph style={$paragraph}>{m.bundler.choice}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.styles.heading}</heading>
              <paragraph style={$paragraph}>{m.styles.needs}</paragraph>
              <paragraph style={$paragraph}>{m.styles.scss}</paragraph>
              <paragraph style={$paragraph}>{m.styles.tailwind}</paragraph>
              <paragraph style={$paragraph}>{m.styles.emotion}</paragraph>
              <paragraph style={$paragraph}>{m.styles.inline}</paragraph>
              <paragraph style={$paragraph}>{m.styles.limits}</paragraph>
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
              <paragraph style={$paragraph}>{m.backend.bunDetails}</paragraph>
            </section>

            <section style={$section}>
              <heading style={$heading}>{m.backendFramework.heading}</heading>
              <paragraph style={$paragraph}>{m.backendFramework.needs}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.express}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.oak}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.hono}</paragraph>
              <paragraph style={$paragraph}>{m.backendFramework.choice}</paragraph>
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

      {modal === "LOGIN" ? <LoginModal onClose={() => setModal("NONE")} /> : null}
      {modal === "REGISTER" ? <RegisterModal onClose={() => setModal("NONE")} /> : null}
    </route>
  );
}

const m = translate({
  header: ["Contacts Manager", "Менеджер контактов"],
  register: ["Register", "Регистрация"],
  login: ["Login", "Вход"],
  intro: {
    heading: ["Introduction", "Вступление"],
    goal: [
      "The goal of the project is to show how I write code, so the business logic is intentionally simple. Users register and keep a list of contacts. Contacts can be created, edited and deleted. Each contact has a name, email and comment.",
      "Цель проекта - показать, как я пишу код, поэтому бизнес-логика намеренно простая. Пользователи регистрируются и ведут список контактов. Контакты можно создавать, редактировать и удалять. В каждом контакте есть имя, почта и комментарий."
    ],
    criterion: [
      "The main criterion for choosing technologies is simplicity and minimalism, and each section below has the requirements, the options and the choice.",
      "Главный критерий выбора технологий - простота и минимализм, и в каждом разделе ниже есть требования, варианты и выбор."
    ],
    approach: [
      'I wrote the architecture and code myself. AI was used only for learning and proofreading. The source code is available on GitHub: <a href="https://github.com/mnemonick/contacts" target="_blank">github.com/mnemonick/contacts</a>.',
      'Архитектура и код - мои. ИИ использовался только для обучения и пруф-ридинга. Исходный код доступен на GitHub: <a href="https://github.com/mnemonick/contacts" target="_blank">github.com/mnemonick/contacts</a>.'
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
      "<term>TypeScript</term> - the de facto standard. <term>Bun</term> and <term>Vite</term> work with it without configuration. One language is used for the <term>Frontend</term>, the <term>Backend</term>, the web server and the tests, so the whole project is written with the same tools. The choice here was obvious.",
      "<term>TypeScript</term> - стандарт де-факто. <term>Bun</term> и <term>Vite</term> работают с ним без настройки. Один язык используется на <term>Frontend</term>, <term>Backend</term>, в веб-сервере и тестах, поэтому весь проект пишется одними инструментами. Тут выбор был очевиден."
    ]
  },
  framework: {
    heading: ["Frontend framework", "Frontend фреймворк"],
    needs: [
      "My most important requirement for a <term>Frontend</term> framework is that all the component logic lives in one file, not spread across several files (as is usually the case with <term>MVC</term>). I considered the following options:",
      "Мое самое главное требование к <term>Frontend</term> фреймворку: вся логика компонента должна находиться в одном файле, а не размазана по нескольким файлам (как это обычно бывает в <term>MVC</term>). Рассматривал следующие варианты:"
    ],
    angular: [
      "<term>Angular</term> - by default a component is split into three files: a class, an <term>HTML</term> template and styles. I prefer one file.",
      "<term>Angular</term> - по умолчанию компонент разделен на три файла: класс, <term>HTML</term>-шаблон и стили. Я предпочитаю один файл."
    ],
    vue: [
      "<term>Vue</term> - a component is written in one <term>.vue</term> file. But templates have their own language (<term>v-if</term>, <term>v-for</term>), and this file format needs a separate compiler.",
      "<term>Vue</term> - компонент пишется в одном файле <term>.vue</term>. Но у шаблонов свой язык (<term>v-if</term>, <term>v-for</term>), а для этого формата файлов нужен отдельный компилятор."
    ],
    choice: [
      "I settled on <term>React</term> - it meets all the requirements, and its ecosystem is the largest.",
      "Остановился на <term>React</term> - он подходит под все требования, а экосистема у него самая большая."
    ],
    react: [
      "In <term>React</term> a component is a regular <term>TypeScript</term> function with <term>JSX</term>, without a separate template language. The API is small - components and hooks.",
      "В <term>React</term> компонент - это обычная функция на <term>TypeScript</term> с <term>JSX</term>, без своего языка шаблонов. API маленький - компоненты и хуки."
    ]
  },
  bundler: {
    heading: ["Bundler", "Бандлер"],
    needs: [
      "My requirements for a bundler - <term>TypeScript</term> integration, minification, <term>SourceMap</term> support.",
      "Мои требования к бандлеру - интеграция с <term>TypeScript</term>, минификация, поддержка <term>SourceMap</term>."
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
      "<term>Vite</term> - the same <term>Rolldown</term>, but with ready-made settings for <term>TypeScript</term>, minification and <term>SourceMap</term>.",
      "<term>Vite</term> - это тот же <term>Rolldown</term>, но с готовыми настройками для <term>TypeScript</term>, минификации и <term>SourceMap</term>."
    ],
    choice: [
      "In the end I took <term>Vite</term>. It does everything I need, and its config is the most concise.",
      "В итоге я взял <term>Vite</term>. Он делает все, что мне нужно, и конфиг у него самый лаконичный."
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
      "In the end I settled on <term>inline</term> styles. Responsiveness is done with the <term>useLayout</term> hook. Hover is done with event handlers. Animations are described in one global <term>Styles</term> component. Instead of <term>div</term> I use custom tags. The tag name is the role of the layer: <term>section</term>, <term>heading</term>, <term>paragraph</term>. The code shows right away what each layer does, and <term>E2E</term> tests find layers by tag name. This approach has drawbacks too: <term>inline</term> styles have no <term>:hover</term>, <term>@media</term>, <term>@keyframes</term> or pseudo-elements, but the pros outweigh the cons.",
      "В итоге я остановился на <term>inline</term>-стилях. Адаптивность я делаю через хук <term>useLayout</term>. Hover - через обработчики событий. Анимации описаны в одном глобальном компоненте <term>Styles</term>. Вместо <term>div</term> я использую кастомные теги. Имя тега - это роль слоя: <term>section</term>, <term>heading</term>, <term>paragraph</term>. По коду сразу видно, что делает каждый слой, а <term>E2E</term>-тесты находят слои по имени тега. У этого подхода есть и недостатки: у <term>inline</term>-стилей нет <term>:hover</term>, <term>@media</term>, <term>@keyframes</term> и псевдоэлементов, но плюсы перевешивают минусы."
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
      "My main requirement for a state management library is minimalism and a concise API.",
      "Мое самое главное требование для библиотеки по управлению состоянием - минималистичность и лаконичный API."
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
      "My requirements for the <term>Backend</term> language - simplicity and minimalism, and ideally the same tools as on the <term>Frontend</term>. I considered the following options:",
      "Мои требования к <term>Backend</term> языку - простота и минимализм, а в идеале - те же инструменты, что и на <term>Frontend</term>. Рассматривал следующие варианты:"
    ],
    specialized: [
      "<term>Go</term> and <term>Rust</term> - languages for the backend. They are faster and use less memory. But language performance is generally not a bottleneck, and <term>Frontend</term> and <term>Backend</term> would need completely different tools.",
      "<term>Go</term> и <term>Rust</term> - языки для бэкенда. Они быстрее и экономнее по памяти. Но производительность языка в целом не узкое место, а <term>Frontend</term> и <term>Backend</term> тогда пришлось бы разрабатывать совершенно разными инструментами."
    ],
    nodejs: [
      "<term>Node.js</term> - <term>JavaScript</term> on the server. To be honest, <term>JavaScript</term> is not the best language, and <term>TypeScript</term> only partially solves this problem. But <term>Frontend</term> and <term>Backend</term> are developed with the same tools.",
      "<term>Node.js</term> - это <term>JavaScript</term> на сервере. Честно говоря, <term>JavaScript</term> - не самый лучший язык, и <term>TypeScript</term> только частично решает эту проблему. Зато <term>Frontend</term> и <term>Backend</term> разрабатываются одними и теми же инструментами."
    ],
    bunDetails: [
      "<term>Bun</term> - a separate runtime by the author of <term>Node.js</term>. It is written from scratch in <term>Rust</term>. Its main advantage is a more intuitive standard library: the main methods are on the global <term>Bun</term> object.",
      "<term>Bun</term> - отдельный рантайм от автора <term>Node.js</term>. Он написан с нуля на <term>Rust</term>. Главный плюс - более интуитивная стандартная библиотека: основные методы находятся в глобальном объекте <term>Bun</term>."
    ]
  },
  backendFramework: {
    heading: ["Backend framework", "Backend фреймворк"],
    needs: [
      "From a <term>backend</term> framework I need routing, ready-made middleware, and typed requests and responses.",
      "От <term>Backend</term> фреймворка мне нужны роутинг, готовые middleware и типизация запросов и ответов."
    ],
    express: [
      "<term>Express</term> - the most popular one. But it is made for <term>Node.js</term>, its types come as a separate package, and it has no typed client.",
      "<term>Express</term> - самый популярный. Но он сделан под <term>Node.js</term>, типы для него идут отдельным пакетом, и у него нет типизированного клиента."
    ],
    oak: [
      "<term>Oak</term> - made for <term>Bun</term>, but without a typed client.",
      "<term>Oak</term> - сделан под <term>Bun</term>, но типизированного клиента у него нет."
    ],
    hono: [
      "<term>Hono</term> - built on web standards (<term>Request</term>, <term>Response</term>), so it works in <term>Bun</term> without adapters. It has ready-made middleware: <term>cors</term>, <term>bodyLimit</term>, <term>timeout</term>, <term>secureHeaders</term>. It also has a typed client.",
      "<term>Hono</term> - построен на веб-стандартах (<term>Request</term>, <term>Response</term>), поэтому он работает в <term>Bun</term> без адаптеров. У него есть готовые middleware: <term>cors</term>, <term>bodyLimit</term>, <term>timeout</term>, <term>secureHeaders</term>. Еще у него есть типизированный клиент."
    ],
    choice: [
      "<term>Hono</term> covers all the requirements, so I chose it.",
      "<term>Hono</term> закрывает все требования, поэтому выбрал его."
    ]
  },
  database: {
    heading: ["Database", "База данных"],
    needs: [
      "My main requirement for a database is strict typing. I like it when the tool tells me if I am doing something wrong. I considered the following options:",
      "Мое самое главное требование к базе данных - строгая типизация. Мне нравится, когда инструмент подсказывает, если я делаю что-то не так. Рассматривал следующие варианты:"
    ],
    mongodb: [
      "<term>MongoDB</term> - <term>JavaScript</term> integrates better with its <term>JSON</term> structures. But MongoDB has no strict typing.",
      "<term>MongoDB</term> - <term>JavaScript</term> лучше интегрируется с ее <term>JSON</term>-структурами. Но в MongoDB нет строгой типизации."
    ],
    postgresql: [
      "<term>PostgreSQL</term> - a relational database with strict typing.",
      "<term>PostgreSQL</term> - реляционная база данных со строгой типизацией."
    ],
    orm: [
      "Instead of an <term>ORM</term> (for example <term>Prisma</term> or <term>Drizzle</term>) I use the <term>postgres</term> module. Queries are written in plain <term>SQL</term>. Parameters go to the database separately from the query text, so <term>SQL</term> injections are impossible. I prefer low-level control over queries. The downside is that result types are not inferred from the schema and have to be specified manually, but I can live with it.",
      "Вместо <term>ORM</term> (например, <term>Prisma</term> или <term>Drizzle</term>) я использую модуль <term>postgres</term>. Запросы пишутся на чистом <term>SQL</term>. Параметры передаются в базу отдельно от текста запроса, поэтому <term>SQL</term>-инъекции невозможны. Я предпочитаю низкоуровневый контроль над запросами. Минус в том, что типы результатов не выводятся из схемы, и их приходится указывать вручную, но с этим можно жить."
    ],
    migrations: [
      "Migrations are applied by the <term>postgres-shift</term> library from the author of the <term>postgres</term> module. Migrations are plain <term>SQL</term> files. All new ones run in one transaction when the <term>Backend</term> starts. If one fails, none are applied.",
      "Миграции применяет библиотека <term>postgres-shift</term> от автора модуля <term>postgres</term>. Миграции - это обычные <term>SQL</term>-файлы. Все новые выполняются в одной транзакции при запуске <term>Backend</term>. Если одна упадет, не применится ни одна."
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
      "<term>Caddy</term> - a more modern alternative to <term>Nginx</term>. It obtains and renews <term>HTTPS</term> certificates by itself. But it is also a separate tool with its own <term>DSL</term>.",
      "<term>Caddy</term> - более современная альтернатива <term>Nginx</term>. Она сама получает и продлевает <term>HTTPS</term>-сертификаты. Но это тоже отдельный инструмент со своим <term>DSL</term>."
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
      "<term>RPC</term> over <term>HTTP</term> on <term>Hono</term> - this is not quite classic <term>REST</term>, because endpoints are named with verbs (<term>/get-user</term>, <term>/create-contact</term>), not resources, but in my opinion it is much more convenient.",
      "<term>RPC</term> поверх <term>HTTP</term> на <term>Hono</term> - это не совсем классический <term>REST</term>, потому что эндпоинты названы глаголами (<term>/get-user</term>, <term>/create-contact</term>), а не ресурсами, но как по мне так намного удобнее."
    ]
  },
  tests: {
    heading: ["Tests", "Тесты"],
    e2e: [
      "I am a proponent of <term>E2E</term> testing. I am a huge fan of <term>E2E</term> testing. Such a test checks what the user sees. It does not depend on the implementation. So it does not break during refactoring. Unit and integration tests catch far fewer bugs.",
      "Я сторонник <term>E2E</term>-тестирования. Я огромный фанат <term>E2E</term>-тестирования. Такой тест проверяет то, что видит пользователь. Он не зависит от реализации. Поэтому он не ломается при рефакторинге. Unit и интеграционные тесты ловят намного меньше багов."
    ],
    cypress: [
      "<term>Cypress</term> - tests run inside the browser, so working with several tabs and domains is harder. Some features are paid.",
      "<term>Cypress</term> - тесты выполняются внутри браузера, поэтому сложнее работать с несколькими вкладками и доменами. Часть функций платная."
    ],
    playwright: [
      "<term>Playwright</term> - waits for elements by itself. It has a built-in test runner and one API for <term>Chromium</term>, <term>Firefox</term> and <term>WebKit</term>. That is the one I chose. The whole functionality of the application is covered by <term>E2E</term> tests that run automatically after every commit to main.",
      "<term>Playwright</term> - сам ждет появления элементов. У него есть встроенный тест-раннер и один API для <term>Chromium</term>, <term>Firefox</term> и <term>WebKit</term>. Его я и выбрал. Весь функционал приложения покрыт <term>E2E</term>-тестами, которые запускаются автоматически после каждого коммита в main."
    ]
  },
  lint: {
    heading: ["Linting", "Линтинг"],
    needs: [
      "My requirements for a linter - linting and formatting in one tool, flexible rule configuration. I considered the following options:",
      "Мои требования к линтеру - линтинг и форматирование в одном инструменте, гибкая настройка правил. Рассматривал следующие варианты:"
    ],
    eslint: [
      "<term>ESLint</term> - needs plugins for <term>TypeScript</term> and <term>React</term>, and formatting needs a separate <term>Prettier</term>. That makes two tools instead of one.",
      "<term>ESLint</term> - для <term>TypeScript</term> и <term>React</term> ему нужны плагины, а для форматирования нужен отдельный <term>Prettier</term>. Получается два инструмента вместо одного."
    ],
    biome: [
      "<term>Biome</term> - a linter and formatter in one tool, with one config and no plugins. It is written in <term>Rust</term>. It is many times faster. In the end I took <term>Biome</term>. Linting and formatting run automatically in the repository on every commit.",
      "<term>Biome</term> - линтер и форматтер в одном инструменте, с одним конфигом и без плагинов. Он написан на <term>Rust</term>. Работает в разы быстрее. В итоге взял <term>Biome</term>. Линтинг и форматирование запускаются автоматически в репозитории при каждом коммите."
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
      "<term>Temporal</term> - a built-in standard without dependencies. It is available in <term>Bun</term> and in browsers. The downside is that it is new, and <term>Safari</term> does not support it yet, so it needs a polyfill there. But it is the future standard, so I chose it.",
      "<term>Temporal</term> - встроенный стандарт без зависимостей. Он есть в <term>Bun</term> и в браузерах. Минус в том, что это новый стандарт, и в <term>Safari</term> его пока нет, поэтому там нужен полифилл. Но это будущий стандарт, поэтому выбрал его."
    ]
  }
});
