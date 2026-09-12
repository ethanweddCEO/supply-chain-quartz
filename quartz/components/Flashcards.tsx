import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Flashcards: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug?.toLowerCase().replace(/\/$/, "")
  const title = fileData.frontmatter?.title?.toLowerCase()
  if (slug !== "flashcards" && title !== "flashcards") return null

  return (
    <section class="flashcards-app" aria-labelledby="flashcards-title">
      <div class="flashcards-header">
        <div>
          <p class="flashcards-kicker">Private to this browser</p>
          <h2 id="flashcards-title">Build your study deck</h2>
          <p>
            Add your own terms and definitions. Your cards and quiz history stay on this device and
            are never sent to a server.
          </p>
        </div>
        <div class="flashcards-stat" aria-live="polite">
          <strong id="flashcards-count">0</strong>
          <span>saved cards</span>
        </div>
      </div>

      <div class="flashcards-grid">
        <form id="flashcard-form" class="flashcard-panel">
          <h3>Add a card</h3>
          <label>
            Term
            <input id="flashcard-term" name="term" required maxlength={80} />
          </label>
          <label>
            Definition
            <textarea id="flashcard-definition" name="definition" required maxlength={500} />
          </label>
          <label>
            Tags <span class="flashcards-muted">(optional)</span>
            <input id="flashcard-tags" name="tags" placeholder="procurement, planning" />
          </label>
          <button type="submit" class="flashcards-primary">
            Save card
          </button>
          <p id="flashcard-form-status" class="flashcards-status" role="status" />
        </form>

        <div class="flashcard-panel">
          <div class="flashcards-panel-heading">
            <h3>Your deck</h3>
            <button id="flashcards-clear" type="button" class="flashcards-text-button">
              Clear personal cards
            </button>
          </div>
          <div id="flashcards-list" class="flashcards-list" aria-live="polite" />
        </div>
      </div>

      <div class="flashcard-panel flashcards-quiz-panel">
        <div class="flashcards-panel-heading">
          <div>
            <p class="flashcards-kicker">Practice mode</p>
            <h3>Run a quiz</h3>
          </div>
          <div id="flashcards-history-summary" class="flashcards-history-summary" />
        </div>
        <div id="flashcards-setup" class="flashcards-setup">
          <label>
            Difficulty
            <select id="flashcards-difficulty">
              <option value="quick">Quick · 5 cards · 60 seconds</option>
              <option value="standard" selected>
                Standard · 10 cards · 2 minutes
              </option>
              <option value="deep">Deep · 15 cards · 5 minutes</option>
            </select>
          </label>
          <button id="flashcards-start" type="button" class="flashcards-primary">
            Start quiz
          </button>
        </div>
        <div id="flashcards-quiz" class="flashcards-quiz" hidden>
          <div class="flashcards-quiz-meta">
            <span id="flashcards-progress" />
            <strong id="flashcards-timer" />
          </div>
          <h4 id="flashcards-question" />
          <label>
            Your answer
            <textarea id="flashcards-answer" autocomplete="off" />
          </label>
          <div class="flashcards-quiz-actions">
            <button id="flashcards-submit" type="button" class="flashcards-primary">
              Check answer
            </button>
            <button id="flashcards-skip" type="button" class="flashcards-text-button">
              Skip
            </button>
          </div>
          <p id="flashcards-feedback" class="flashcards-feedback" role="status" />
        </div>
        <div id="flashcards-results" class="flashcards-results" hidden />
      </div>
    </section>
  )
}

Flashcards.afterDOMLoaded = `
(() => {
  const root = document.querySelector(".flashcards-app")
  if (!root) return

  const storageKey = "supply-chain-dictionary.flashcards.v1"
  const seedCards = [
    { term: "Purchasing", definition: "Tactical, transaction-focused work such as placing purchase orders, tracking lead times, and handling routine buying.", tags: ["purchasing"] },
    { term: "Procurement", definition: "The strategic discipline of deciding what to buy, from whom, why, and under what commercial terms.", tags: ["procurement"] },
    { term: "Strategic sourcing", definition: "A comprehensive approach to finding and developing suppliers while balancing price, quality, risk, lead time, and long-term value.", tags: ["sourcing"] },
    { term: "MRO supplies", definition: "Maintenance, repair, and operating supplies that support the business but do not become part of the finished product.", tags: ["inventory"] },
    { term: "ERP", definition: "Enterprise resource planning software that connects business functions and provides shared operational data.", tags: ["planning", "systems"] },
    { term: "MRP", definition: "Material requirements planning that determines what materials are needed, in what quantity, and when they should be ordered.", tags: ["planning"] },
    { term: "SRM", definition: "Supplier relationship management: a cross-functional process for managing supplier performance, collaboration, contracts, and long-term value.", tags: ["suppliers"] },
    { term: "Holding cost", definition: "The cost of carrying inventory, including storage, capital, insurance, obsolescence, and capacity impacts.", tags: ["inventory", "cost"] },
    { term: "Net requirements", definition: "The remaining demand after considering projected available balance, scheduled receipts, safety stock, and other supply.", tags: ["planning"] },
    { term: "Purchase order", definition: "A formal buyer document authorizing a supplier to provide specified goods or services under agreed terms.", tags: ["purchasing"] },
    { term: "Approved vendor list", definition: "A controlled list of suppliers that have been evaluated and qualified to provide specific goods or services.", tags: ["suppliers"] },
    { term: "Total cost of ownership", definition: "The full cost of an item or supplier relationship across purchase price, logistics, quality, service, risk, and lifecycle impacts.", tags: ["sourcing", "cost"] },
  ]
  const difficulty = {
    quick: { seconds: 60, count: 5 },
    standard: { seconds: 120, count: 10 },
    deep: { seconds: 300, count: 15 },
  }
  let cards = []
  let history = []
  let quiz = null
  let timer = null

  const byId = (id) => document.getElementById(id)
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]))
  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}")
      cards = Array.isArray(saved.cards) ? saved.cards : []
      history = Array.isArray(saved.history) ? saved.history : []
    } catch {
      cards = []
      history = []
    }
  }
  const save = () => localStorage.setItem(storageKey, JSON.stringify({ cards, history }))
  const allCards = () => [...seedCards, ...cards]
  const render = () => {
    const personal = cards
    byId("flashcards-count").textContent = String(personal.length)
    byId("flashcards-list").innerHTML = personal.length
      ? personal.map((card, index) => '<article class="flashcard-item"><div><strong>' + escapeHtml(card.term) + '</strong><p>' + escapeHtml(card.definition) + '</p><small>' + escapeHtml((card.tags || []).join(" · ")) + '</small></div><button type="button" data-remove-card="' + index + '" aria-label="Remove ' + escapeHtml(card.term) + '">Remove</button></article>').join("")
      : '<p class="flashcards-muted">Your personal cards will appear here. The built-in dictionary deck is always available in quizzes.</p>'
    const attempts = history.length
    const average = attempts ? Math.round(history.reduce((sum, item) => sum + item.percent, 0) / attempts) : 0
    byId("flashcards-history-summary").textContent = attempts ? attempts + " quizzes · " + average + "% average" : "No quiz history yet"
  }
  const finishQuiz = () => {
    if (!quiz) return
    clearInterval(timer)
    const percent = Math.round((quiz.correct / quiz.total) * 100)
    history.unshift({ date: new Date().toISOString(), correct: quiz.correct, total: quiz.total, percent })
    history = history.slice(0, 20)
    save()
    byId("flashcards-quiz").hidden = true
    byId("flashcards-results").hidden = false
    byId("flashcards-results").innerHTML = '<h4>Quiz complete</h4><p class="flashcards-score">' + percent + '%</p><p>' + quiz.correct + ' of ' + quiz.total + ' answers matched the key terms.</p><button type="button" class="flashcards-primary" id="flashcards-again">Run another quiz</button>'
    byId("flashcards-setup").hidden = false
    quiz = null
    render()
  }
  const showQuestion = () => {
    if (!quiz || quiz.index >= quiz.questions.length) return finishQuiz()
    const card = quiz.questions[quiz.index]
    byId("flashcards-progress").textContent = "Card " + (quiz.index + 1) + " of " + quiz.questions.length
    byId("flashcards-timer").textContent = quiz.remaining + "s"
    byId("flashcards-question").textContent = "Define: " + card.term
    byId("flashcards-answer").value = ""
    byId("flashcards-feedback").textContent = ""
    byId("flashcards-answer").focus()
  }
  const answer = (isSkip) => {
    if (!quiz) return
    const card = quiz.questions[quiz.index]
    const response = byId("flashcards-answer").value.trim().toLowerCase()
    const correct = !isSkip && response.length > 0 && (card.definition.toLowerCase().includes(response) || response.split(" ").filter(Boolean).filter((word) => card.definition.toLowerCase().includes(word)).length >= 3)
    if (correct) quiz.correct += 1
    byId("flashcards-feedback").innerHTML = (correct ? "<strong>Correct.</strong> " : "<strong>Review this one.</strong> ") + escapeHtml(card.definition)
    quiz.index += 1
    window.setTimeout(showQuestion, 900)
  }
  byId("flashcard-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const term = byId("flashcard-term").value.trim()
    const definition = byId("flashcard-definition").value.trim()
    const tags = byId("flashcard-tags").value.split(",").map((tag) => tag.trim()).filter(Boolean)
    if (!term || !definition) return
    cards.unshift({ term, definition, tags })
    save()
    render()
    event.target.reset()
    byId("flashcard-form-status").textContent = "Card saved on this device."
  })
  byId("flashcards-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-card]")
    if (!button) return
    cards.splice(Number(button.dataset.removeCard), 1)
    save()
    render()
  })
  byId("flashcards-clear").addEventListener("click", () => {
    if (!cards.length || !window.confirm("Remove all personal cards from this device?")) return
    cards = []
    save()
    render()
  })
  byId("flashcards-start").addEventListener("click", () => {
    const mode = difficulty[byId("flashcards-difficulty").value]
    const pool = allCards().sort(() => Math.random() - 0.5)
    quiz = { questions: pool.slice(0, Math.min(mode.count, pool.length)), index: 0, correct: 0, total: Math.min(mode.count, pool.length), remaining: mode.seconds }
    byId("flashcards-results").hidden = true
    byId("flashcards-setup").hidden = true
    byId("flashcards-quiz").hidden = false
    timer = window.setInterval(() => {
      if (!quiz) return
      quiz.remaining -= 1
      byId("flashcards-timer").textContent = quiz.remaining + "s"
      if (quiz.remaining <= 0) finishQuiz()
    }, 1000)
    showQuestion()
  })
  byId("flashcards-submit").addEventListener("click", () => answer(false))
  byId("flashcards-skip").addEventListener("click", () => answer(true))
  byId("flashcards-answer").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") answer(false)
  })
  root.addEventListener("click", (event) => {
    if (event.target.id === "flashcards-again") {
      byId("flashcards-results").hidden = true
      byId("flashcards-setup").hidden = false
    }
  })
  load()
  render()
  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => clearInterval(timer))
  }
})()
`

Flashcards.css = `
.flashcards-app { margin-top: 3rem; border-top: 1px solid var(--lightgray); padding-top: 2rem; }
.flashcards-header, .flashcards-panel-heading, .flashcards-quiz-meta, .flashcards-quiz-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.flashcards-header { margin-bottom: 1.5rem; }
.flashcards-kicker { color: var(--secondary); font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 .35rem; }
.flashcards-header h2, .flashcards-panel h3 { margin-top: 0; }
.flashcards-header p { max-width: 42rem; }
.flashcards-stat { border: 1px solid var(--lightgray); border-radius: .75rem; padding: .75rem 1rem; text-align: center; white-space: nowrap; }
.flashcards-stat strong { display: block; color: var(--secondary); font-size: 1.5rem; }
.flashcards-stat span, .flashcards-muted { color: var(--gray); font-size: .85rem; }
.flashcards-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 1rem; }
.flashcard-panel { border: 1px solid var(--lightgray); border-radius: .75rem; background: color-mix(in srgb, var(--secondary) 3%, var(--light)); padding: 1.25rem; }
.flashcard-panel label, .flashcards-setup label { display: grid; gap: .35rem; margin-bottom: .85rem; font-weight: 600; }
.flashcard-panel input, .flashcard-panel textarea, .flashcards-setup select, .flashcards-quiz textarea { border: 1px solid var(--lightgray); border-radius: .45rem; background: var(--light); color: var(--dark); font: inherit; padding: .65rem .75rem; }
.flashcard-panel textarea, .flashcards-quiz textarea { min-height: 5rem; resize: vertical; }
.flashcards-primary { border: 0; border-radius: .45rem; background: var(--secondary); color: white; cursor: pointer; font: inherit; font-weight: 700; padding: .65rem 1rem; }
.flashcards-primary:hover { background: var(--tertiary); }
.flashcards-text-button { border: 0; background: transparent; color: var(--secondary); cursor: pointer; font: inherit; padding: .25rem; }
.flashcards-text-button:hover { color: var(--tertiary); }
.flashcards-status, .flashcards-feedback { min-height: 1.4rem; color: var(--tertiary); font-size: .9rem; }
.flashcards-list { display: grid; gap: .65rem; max-height: 23rem; overflow: auto; }
.flashcard-item { display: flex; align-items: start; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--lightgray); padding-bottom: .65rem; }
.flashcard-item p { margin: .2rem 0; font-size: .9rem; }
.flashcard-item small { color: var(--secondary); }
.flashcard-item button { border: 0; background: transparent; color: var(--gray); cursor: pointer; font-size: .8rem; }
.flashcards-quiz-panel { margin-top: 1rem; }
.flashcards-setup { display: flex; align-items: end; gap: 1rem; }
.flashcards-setup label { flex: 1; margin: 0; }
.flashcards-quiz-meta { border-bottom: 1px solid var(--lightgray); padding-bottom: .75rem; color: var(--gray); }
.flashcards-quiz-meta strong { color: var(--secondary); }
.flashcards-quiz h4 { font-size: 1.4rem; margin-bottom: 1rem; }
.flashcards-score { color: var(--secondary); font-size: 3rem; font-weight: 700; margin: .5rem 0; }
@media all and (max-width: 800px) { .flashcards-header, .flashcards-setup { align-items: stretch; flex-direction: column; } .flashcards-grid { grid-template-columns: 1fr; } .flashcards-stat { text-align: left; } }
`

export default (() => Flashcards) satisfies QuartzComponentConstructor
