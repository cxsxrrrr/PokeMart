import { useEffect, useRef } from 'react';
import { CONSTANTS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const CartPanel = ({ isOpen, items, onClose, onIncrease, onDecrease, onRemove, total }) => {
  const panelBodyRef = useRef(null);

  useEffect(() => {
    if (isOpen && panelBodyRef.current) {
      panelBodyRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  return (
    <div className={`cart-panel${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="cart-panel__backdrop" onClick={onClose} />
      <aside className="cart-panel__body" role="dialog" ref={panelBodyRef} tabIndex={-1}>
        <header className="cart-panel__header">
          <h2>Tu carrito</h2>
          <button className="cart-panel__close" onClick={onClose}>×</button>
        </header>
        <div className="cart-panel__content">
          {items.length ? (
            <ul className="cart-panel__list">
              {items.map((item) => (
                <li className="cart-item-row" key={item.id}>
                  <img src={item.image || CONSTANTS.PLACEHOLDER_IMAGE} alt={item.name} />
                  <div className="cart-item-row__meta">
                    <div className="cart-item-row__name">{item.name}</div>
                    <div className="cart-item-row__set">{item.setName}</div>
                    <div className="cart-item-row__actions">
                      <button className="cart-qty-btn" onClick={() => onDecrease(item.id)}>−</button>
                      <span className="cart-item-row__qty">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => onIncrease(item.id)}>+</button>
                    </div>
                    <button className="cart-item-row__remove" onClick={() => onRemove(item.id)}>Eliminar</button>
                  </div>
                  <div className="cart-item-row__controls">
                    <span className="cart-item-row__price">{formatCurrency(item.price)} c/u</span>
                    <span className="cart-item-row__subtotal">Sub: {formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="cart-panel__empty">Tu carrito está vacío por ahora.</div>
          )}
        </div>
        <footer className="cart-panel__footer">
          <div className="cart-panel__summary">
            <span>Total estimado</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button className="cart-panel__checkout" onClick={() => alert("Checkout pendiente...")}>Proceder al pago</button>
        </footer>
      </aside>
    </div>
  );
};

export default CartPanel;