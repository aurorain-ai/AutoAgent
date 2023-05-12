<p align="center">
  <img src="https://github.com/aurorain-ai/DataGPT/blob/3a1afa1fefa5784a41243e2ebfc5c0971cd842f7/public/DataGPT.png" height="200"/>
</p>
<p align="center">
  <em>🤖 AI copilot for data analytics, data engineering, and ML science. 🤖 </em>
</p>

<p align="center">
<a href="https://datagpt.auroain.ai">🔗 Short link</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://twitter.com/luhuihu">🐦 Twitter</a>
</p>

---

<h2 align="center">
💝 Support the Advancement of AgentGPT!! 💝
</h2>

<p align="center">
Join us in fueling the development of AgentGPT, an open-source project pushing the boundaries of AI autonomy! We're facing challenges in covering the operational costs 💸, including in-house API and other infrastructure expenses, which is projected to grow to around $1000 USD per day 💳🤕 Your sponsorship would drive progress by helping us scale up resources, enhance features and functionality, and continue to iterate on this exciting project! 🚀
</p>

<p align="center">
By sponsoring this free, open-source project, you not only have the opportunity to have your avatar/logo featured below, but also get the exclusive chance to chat with the founders!🗣️
</p>

<p align="center">
<a href="https://github.com/sponsors/reworkd-admin">👉 Click here</a> to support the project
</p>

</div>

---

DataGPT is AI copilot for data analytics, data engineering, and ML science. 🚀.

## 🎉 Roadmap

This platform is currently in alpha, we are currently working on:

- Long term memory via a vector DB 🧠
- Web browsing capabilities via LangChain 🌐
- Interaction with websites and people 👨‍👩‍👦
- Writing capabilities via a document API 📄
- Saving agent runs 💾
- Users and authentication 🔐
- Stripe integration for a lower limit paid version (So we can stop worrying about infra costs) 💵

More Coming soon...

## 🚀 Tech Stack

- ✅ **Bootstrapping**: [create-t3-app](https://create.t3.gg).
- ✅ **Framework**: [Nextjs 13 + Typescript](https://nextjs.org/).
- ✅ **Auth**: [Next-Auth.js](https://next-auth.js.org)
- ✅ **ORM**: [Prisma](https://prisma.io).
- ✅ **Database**: [Supabase](https://supabase.com/).
- ✅ **Styling**: [TailwindCSS + HeadlessUI](https://tailwindcss.com).
- ✅ **Typescript Schema Validation**: [Zod](https://github.com/colinhacks/zod).
- ✅ **End-to-end typesafe API**: [tRPC](https://trpc.io/).

## 👨‍🚀 Getting Started

### 🐳 Docker Setup

The easiest way to run DataGPT locally is by using docker.
A convenient setup script is provided to help you get started.

```bash
./setup.sh --docker
```

### 👷 Local Development Setup

If you wish to develop DataGPT locally, the easiest way is to
use the provided setup script.

```bash
./setup.sh --local
```

### 🛠️ Manual Setup

> 🚧 You will need [Nodejs +18 (LTS recommended)](https://nodejs.org/en/) installed.

1. Clone the repository:

```bash
git clone git@github.com:aurorain-ai/DataGPT.git
```

3. Install dependencies:

```bash
cd DataGPT
npm install
```

4. Create a **.env** file with the following content:

> 🚧 The environment variables must match the following [schema](https://github.com/aurorain-ai/DataGPT/blob/main/src/env/schema.mjs).

```bash
# Deployment Environment:
NODE_ENV=development

# Next Auth config:
# Generate a secret with `openssl rand -base64 32`
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./db.sqlite

# Your open api key
OPENAI_API_KEY=changeme

# Snowflake account info
SNOWFLAKE_ACCOUNT=changeme
SNOWFLAKE_USERNAME=changeme
SNOWFLAKE_PASSWORD=changeme
SNOWFLAKE_REGION=changeme
SNOWFLAKE_WAREHOUSE=changeme
SNOWFLAKE_DATABASE=changeme
SNOWFLAKE_SCHEMA=changeme
```

5. Modify prisma schema to use sqlite:

```bash
./prisma/useSqlite.sh
```

**Note:** This only needs to be done if you wish to use sqlite.

6. Ready 🥳, now run:

```bash
# Create database migrations
npx prisma db push
npm run dev:all
```

### 🚀 GitHub Codespaces

Set up AgentGPT in the cloud immediately by using [GitHub Codespaces](https://github.com/features/codespaces).

1. From the GitHub repo, click the green "Code" button and select "Codespaces".
2. Create a new Codespace or select a previous one you've already created.
3. Codespaces opens in a separate tab in your browser.
4. In terminal, run `bash ./setup.sh --local`
5. When prompted in terminal, add your OpenAI API key.
6. Click "Open in browser" when the build process completes.

- To shut AgentGPT down, enter Ctrl+C in Terminal.
- To restart AgentGPT, run `npm run dev` in Terminal.

Run the project 🥳

```
npm run dev:all
```

---

</div>
