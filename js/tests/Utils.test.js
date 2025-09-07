import {setDiscountText, createDeals} from "../components/utils";

test('renders correct discount text based on offer type', () => {


  const discountInfoPercentage = {
    discount: 10,
    type: 'percentage'
  }

  const discountInfoAmount = {
    discount: 20,
    type: 'amount'
  }

  const resultPercentage = setDiscountText(discountInfoPercentage);

  const resultAmount = setDiscountText(discountInfoAmount);

  expect(resultPercentage).toEqual('10% Off')

  expect(resultAmount).toEqual('$20 Off');
})


test('creates deals as expected from data', () => {
  const discountDeals = [
    {
      offer_type: 'amount',
      promotion_id: '1712',
      discount: 10
    },
    {
      offer_type: 'percentage',
      promotion_id: '1711',
      discount: 25
    },
    {
      offer_type: 'amount',
      promotion_id: '1713',
      discount: 15
    },
  ];

  const result = createDeals(discountDeals);

  expect(result.length).toEqual(6);

  expect(result[0]).toEqual({
    type: 'amount',
    promotion: '1712',
    discount: 10
  },)
})

test('Expect for deals to not be created if there are at least 6 deals', () => {
  const discountDeals = [
    {
      offer_type: 'amount',
      promotion_id: '1712',
      discount: 10
    },
    {
      offer_type: 'percentage',
      promotion_id: '1711',
      discount: 25
    },
    {
      offer_type: 'amount',
      promotion_id: '1713',
      discount: 15
    },
    {
      offer_type: 'amount',
      promotion_id: '1712',
      discount: 10
    },
    {
      offer_type: 'percentage',
      promotion_id: '1711',
      discount: 25
    },
    {
      offer_type: 'amount',
      promotion_id: '1713',
      discount: 15
    },
    {
      offer_type: 'amount',
      promotion_id: '1713',
      discount: 15
    },
  ];

  const result = createDeals(discountDeals);

  expect(result.length).toEqual(7);

})
