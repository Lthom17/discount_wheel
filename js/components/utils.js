export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function setDiscountText(discountInfo) {
  if(discountInfo.type === 'amount'){
    return `$${discountInfo.discount} Off`
  }else if (discountInfo.type === 'percentage'){
    return `${discountInfo.discount}% Off`
  }
}
export function getDiscountWheelSettings() {
  const settings = window?.drupalSettings?.discountWheel || {};
  return {
    popupTitleSetting: settings.popupTitle || 'Spin the wheel!',
    congratsTextSetting: settings.congratsText || 'You won!',
    slicesSetting: settings.slices || [],
    disclaimerTextSetting: settings.disclaimerText,
  };
}

export function parseDiscountInfo(data) {
  const discountParsedData = [];
  for(let discount of data){
    discountParsedData.push({
      id: discount?.promotion_id,
      label: discount?.display_name,
    })
  }
  return discountParsedData;
}

export function createDeals(discountDeals){
  let discountLabels = [];
  for(let discountItem of discountDeals){
      discountLabels.push({
        type: discountItem?.offer_type,
        promotion: discountItem?.promotion_id,
        discount: discountItem?.discount
      });
    }

  let fillDeals = [...discountLabels];

  if (discountLabels.length > 0 && discountLabels.length < 6) {
    const originalLength = discountLabels.length;
    let i = 0;
    while (fillDeals.length < 6) {
      fillDeals.push({ ...discountLabels[i] });
      if (i < originalLength - 1) {
        i++;
      } else {
        i = 0;
      }
    }
  }

  return fillDeals;
}
