import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Check() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  /* ===================== */
  /* FETCH ORDER */
  /* ===================== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/administrations/public/orders/${orderId}`);
        setOrder(res.data);
      } catch (e) {
        console.error(e);
        setError("Chekni olishda xatolik");
      }
    };
    load();
  }, [orderId]);

  /* ===================== */
  /* AUTO PRINT + CLOSE */
  /* ===================== */
  useEffect(() => {
    if (!order) return;

    localStorage.setItem("printStatus", "pending");

    const mql = window.matchMedia("print");
    const onChange = (e) => {
      if (!e.matches) {
        localStorage.setItem("printStatus", "success");
        window.close();
      }
    };

    mql.addEventListener("change", onChange);

    setTimeout(() => {
      window.focus();
      window.print();
    }, 300);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, [order]);

  if (error) return <div>{error}</div>;
  if (!order) return <div>Yuklanmoqda…</div>;

  const date = new Date(order.date);

  return (
    <>
      {/* PRINT STYLE */}
      <style>{`
        @page {
          size: 58mm auto;
          margin: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 58mm;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
        }

        .check {
          width: 58mm;
          padding: 6px 5px;
          font-size: 12px;
          line-height: 1.3;
          text-align: center;
        }

        .check-title {
          font-size: 25px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .divider {
          border-top: 2px dashed #000;
          margin: 6px 0;
        }

        .text {
          font-size: 12px;
          margin: 2px 0;
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          margin-top: 4px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 12px;
          margin: 2px 0;
        }

        .row span:first-child {
          max-width: 38mm;
          word-break: break-word;
          text-align: left;
        }

        .jami {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
          margin-top: 4px;
        }

        .footer {
          font-size: 11px;
          margin-top: 6px;
        }
      `}</style>

      <div className="check">
        <div className="check-title">SAMPI MEDLINE</div>

        <div className="divider" />

        <div className="text">Bemor: {order.patientName}</div>
        <div className="text">
          Sana: {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString().slice(0, 5)}
        </div>

        <div className="divider" />

        {/* DORILAR */}
        {order.items?.some((i) => i.type === "medicine") && (
          <>
            <div className="section-title">Dorilar</div>
            <div className="divider" />
            {order.items
              .filter((i) => i.type === "medicine")
              .map((i, idx) => (
                <div className="row" key={idx}>
                  <span>
                    {i.name} x{i.quantity}
                  </span>
                  <span>{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            <div className="divider" />
          </>
        )}

        {/* XIZMATLAR */}
        {order.items?.some((i) => i.type === "service") && (
          <>
            <div className="section-title">Xizmatlar</div>
            <div className="divider" />
            {order.items
              .filter((i) => i.type === "service")
              .map((i, idx) => (
                <div className="row" key={idx}>
                  <span>{i.name}</span>
                  <span>{i.price.toLocaleString()}</span>
                </div>
              ))}
            <div className="divider" />
          </>
        )}

        <div className="jami">
          <span>Jami:</span>
          <span>{order.total.toLocaleString()} so‘m</span>
        </div>

        <div className="divider" />
        <div className="footer">Doimo sog‘-salomat bo‘ling 🤍</div>
      </div>
    </>
  );
}
