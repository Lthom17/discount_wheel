export function getUniqueCoupon(couponAmount, promotionId) {

  return fetch('/discount-wheel/generate-coupon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      discount: couponAmount,
      promotion_id: promotionId
    }),
  })
    .then(res => res.json())
    .then(data => data?.coupon_code);

}
