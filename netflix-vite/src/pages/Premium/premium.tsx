import React from "react";
import "./premium.css";

const plans = [
  {
    name: "Basic",
    badge: "АКЦІЯ",
    price: "99",
    trial: "Перші 7 днів - 29 грн*",
    devices: "1 пристрій",
    quality: "HD (720p)",
    catalog: "Базовий\nкаталог",
    support: "TV, Smart TV,\nPhone, PC",
  },
  {
    name: "Standard",
    badge: "-35%",
    price: "249",
    trial: "Перші 7 днів - 69 грн*",
    devices: "2 пристрої",
    quality: "Full HD (1080p)",
    catalog: "Розширений\nкаталог",
    support: "TV, Smart TV,\nPhone, PC",
    popular: true,
  },
  {
    name: "Premium",
    badge: "-10%",
    price: "449",
    trial: "Перші 7 днів - 100 грн*",
    devices: "4 пристрої",
    quality: "4K Ultra HD + HDR",
    catalog: "Повний доступ\n(Всі прем’єри)",
    support: "TV, Smart TV, Phone,\nPC, Console",
    top: true,
  },
];

const comparisonRows = [
  ["Щомісячна ціна", "99 грн", "249 грн", "449 грн"],
  ["Одночасний перегляд", "1 пристрій", "2 пристрої", "4 пристрої"],
  ["Максимальна якість", "HD (720p)", "Full HD (1080p)", "4K Ultra HD + HDR"],
  ["Доступ до TV-\nканалів та кіно", "Базовий\nкаталог", "Розширений\nкаталог", "Повний доступ\n(Всі прем’єри)"],
  ["Підтримка\nпристроїв", "TV, Smart TV,\nPhone, PC", "TV, Smart TV,\nPhone, PC", "TV, Smart TV, Phone,\nPC, Console"],
];

export default function Premium() {
  return (
    <main className="premium-page">
      <div className="premium-topbar">
        <span>ТВ КІНО</span>
      </div>

      <section className="premium-content">
        <h1>Вибирайте найкращу передплату<br />для вас та вашої сім’ї</h1>

        <div className="plans">
          {plans.map((plan) => (
            <article className="plan-card" key={plan.name}>
              <div className="plan-badges">
                <span className="plan-badge">{plan.badge}</span>
                {plan.top && <span className="plan-top">ТОП ПРОДАЖІВ</span>}
              </div>

              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span>від {plan.price} грн/міс</span>
              </div>
              <div className="plan-trial">{plan.trial}</div>

              <button type="button" className="plan-button">
                Підключити
              </button>
            </article>
          ))}
        </div>

        <h2>Детальне порівняння тарифних планів</h2>

        <div className="comparison">
          <div className="comparison-header">
            <div>Параметр / Функція</div>
            <div>Basic</div>
            <div className="standard-heading">
              <span className="best-label">НАЙПОПУЛЯРНІШЕ</span>
              Standard
            </div>
            <div>Premium</div>
          </div>

          {comparisonRows.map(([label, basic, standard, premium]) => (
            <div className="comparison-row" key={label}>
              <div className="row-label">
                {label.split("\n").map((line, i) => (
                  <React.Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </div>
              {[basic, standard, premium].map((value, i) => (
                <div key={i} className="row-value">
                  {value.split("\n").map((line, j) => (
                    <React.Fragment key={line}>
                      {j > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="premium-note">
          Скасувати або змінити тарифний план можна в будь-який<br />
          момент у налаштуваннях профілю
        </p>
      </section>
    </main>
  );
}