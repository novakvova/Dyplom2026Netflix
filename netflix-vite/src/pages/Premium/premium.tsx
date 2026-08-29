import React from "react";

interface Plan {
  name: string;
  badge: string;
  price: string;
  trial: string;
  top?: boolean;
}

const plans: Plan[] = [
  {
    name: "Basic",
    badge: "АКЦІЯ",
    price: "99",
    trial: "Перші 7 днів - 29 грн*",
  },
  {
    name: "Standard",
    badge: "-35%",
    price: "249",
    trial: "Перші 7 днів - 69 грн*",
  },
  {
    name: "Premium",
    badge: "-10%",
    price: "449",
    trial: "Перші 7 днів - 100 грн*",
    top: true,
  },
];

const comparisonRows = [
  {
    label: "Щомісячна ціна",
    values: ["99 грн", "249 грн", "449 грн"],
  },
  {
    label: "Одночасний перегляд",
    values: ["1 пристрій", "2 пристрої", "4 пристрої"],
  },
  {
    label: "Максимальна якість",
    values: ["HD (720p)", "Full HD (1080p)", "4K Ultra HD + HDR"],
  },
  {
    label: "Доступ до TV-\nканалів та кіно",
    values: [
      "Базовий\nкаталог",
      "Розширений\nкаталог",
      "Повний доступ\n(Всі прем’єри)",
    ],
  },
  {
    label: "Підтримка\nпристроїв",
    values: [
      "TV, Smart TV,\nPhone, PC",
      "TV, Smart TV,\nPhone, PC",
      "TV, Smart TV, Phone,\nPC, Console",
    ],
  },
];

export default function Premium() {
  return (
    <main
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #35194d 0%, #321747 50%, #301644 100%)",
        color: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section className="mx-auto w-[635px] px-0 pt-[20px] pb-[80px]">
      
        <div className="text-center">
          <h1
            className="m-0 font-bold"
            style={{
              fontSize: "24px",
              lineHeight: "31px",
              letterSpacing: "-0.4px",
            }}
          >
            Вибирайте найкращу передплату
            <br />
            для вас та вашої сім’ї
          </h1>

          <p
            className="m-0 mt-[7px]"
            style={{
              color: "rgba(255,255,255,0.48)",
              fontSize: "8px",
            }}
          >
            Оберіть тариф, який підходить саме вам
          </p>
        </div>

        <div className="mx-auto mt-[18px] grid w-[406px] grid-cols-3 gap-[30px]">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="group relative h-[137px] rounded-[7px] transition-all duration-200 hover:-translate-y-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.42)",
                boxShadow: "0 5px 18px rgba(0,0,0,0.12)",
              }}
            >
              <div className="absolute left-[6px] top-[6px] flex items-center gap-[3px]">
                <span
                  className="rounded-[3px] px-[5px] py-[1px]"
                  style={{
                    backgroundColor: "#df3040",
                    fontSize: "7px",
                    lineHeight: "11px",
                    fontWeight: 600,
                  }}
                >
                  {plan.badge}
                </span>

                {plan.top && (
                  <span
                    className="rounded-[3px] px-[5px] py-[1px]"
                    style={{
                      backgroundColor: "#a226e7",
                      fontSize: "7px",
                      lineHeight: "11px",
                      fontWeight: 600,
                    }}
                  >
                    ТОП ПРОДАЖІВ
                  </span>
                )}
              </div>

              <div
                className="absolute left-[7px] top-[27px]"
                style={{
                  fontSize: "19px",
                  lineHeight: "23px",
                  fontWeight: 500,
                }}
              >
                {plan.name}
              </div>

              <div
                className="absolute left-[7px] top-[62px] whitespace-nowrap"
                style={{
                  fontSize: "13px",
                  lineHeight: "16px",
                  fontWeight: 700,
                }}
              >
                від {plan.price} грн/міс
              </div>

              <div
                className="absolute left-[7px] top-[81px] whitespace-nowrap"
                style={{
                  color: "rgba(255,255,255,0.43)",
                  fontSize: "7px",
                  lineHeight: "9px",
                }}
              >
                {plan.trial}
              </div>

              <button
                type="button"
                className="absolute bottom-[9px] left-[10px] h-[27px] w-[98px] cursor-pointer rounded-[4px] border-0 text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #9635ed 0%, #8628dd 100%)",
                  boxShadow: "0 3px 9px rgba(132,40,221,0.28)",
                  fontSize: "8px",
                  fontWeight: 500,
                }}
              >
                Підключити
              </button>
            </article>
          ))}
        </div>

        <div className="mt-[19px] text-center">
          <h2
            className="m-0 font-semibold"
            style={{
              fontSize: "12px",
              lineHeight: "15px",
            }}
          >
            Детальне порівняння тарифних планів
          </h2>

          <div
            className="mx-auto mt-[5px] h-[1px] w-[38px] rounded-full"
            style={{
              backgroundColor: "#9a35e8",
            }}
          />
        </div>

        <section
          className="mx-auto mt-[17px] w-[507px] overflow-hidden rounded-[7px]"
          style={{
            backgroundColor: "rgba(20,9,30,0.86)",
            border: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 7px 24px rgba(0,0,0,0.13)",
            padding: "10px 25px 8px",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: "165px 1fr 1fr 1fr",
              height: "29px",
              borderBottom: "1px solid rgba(255,255,255,0.32)",
            }}
          >
            <div
              className="flex items-center"
              style={{
                color: "rgba(255,255,255,0.52)",
                fontSize: "10px",
              }}
            >
              Параметр / Функція
            </div>

            <div
              className="flex items-center justify-center"
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "10px",
              }}
            >
              Basic
            </div>

            <div className="relative flex items-center justify-center">
              <span
                className="absolute -top-[1px] whitespace-nowrap rounded-[3px] px-[4px]"
                style={{
                  backgroundColor: "#a226e7",
                  fontSize: "5px",
                  lineHeight: "7px",
                  fontWeight: 600,
                }}
              >
                НАЙПОПУЛЯРНІШЕ
              </span>

              <span
                className="mt-[6px]"
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "10px",
                }}
              >
                Standard
              </span>
            </div>

            <div
              className="flex items-center justify-center"
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "10px",
              }}
            >
              Premium
            </div>
          </div>

          {comparisonRows.map((row, rowIndex) => (
            <div
              key={row.label}
              className="grid items-center transition-colors duration-150 hover:bg-white/[0.025]"
              style={{
                gridTemplateColumns: "165px 1fr 1fr 1fr",
                minHeight:
                  rowIndex === 3
                    ? "47px"
                    : rowIndex === 4
                    ? "48px"
                    : "32px",
                borderBottom:
                  rowIndex === comparisonRows.length - 1
                    ? "none"
                    : "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div
                className="whitespace-pre-line pr-[8px]"
                style={{
                  color: "rgba(255,255,255,0.53)",
                  fontSize: "9px",
                  lineHeight: "12px",
                }}
              >
                {row.label}
              </div>

              {row.values.map((value, index) => (
                <div
                  key={index}
                  className="whitespace-pre-line text-center"
                  style={{
                    color:
                      index === 1
                        ? "rgba(255,255,255,0.86)"
                        : "rgba(255,255,255,0.75)",
                    fontSize: "9px",
                    lineHeight: "12px",
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </section>

        <p
          className="m-0 mt-[17px] text-center"
          style={{
            color: "rgba(255,255,255,0.40)",
            fontSize: "6px",
            lineHeight: "8px",
          }}
        >
          Скасувати або змінити тарифний план можна в будь-який
          <br />
          момент у налаштуваннях профілю
        </p>
      </section>
    </main>
  );
}