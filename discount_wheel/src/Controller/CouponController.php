<?php

namespace Drupal\discount_wheel\Controller;

use Drupal\Core\Datetime\DrupalDateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\commerce_promotion\Entity\Coupon;
use Drupal\commerce_promotion\Entity\Promotion;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Utility\Random;

class CouponController extends ControllerBase
{
    public function generateCoupon(Request $request) {
    try {
      $data = json_decode($request->getContent(), TRUE);
      $promotion_id = $data['promotion_id'] ?? NULL;
      $expiration = new DrupalDateTime('today 23:59:59');

      if (!$promotion_id || !$promotion = Promotion::load($promotion_id)) {
        return new JsonResponse(['error' => 'Invalid promotion ID'], 400);
      }

      $random = new Random();
      $code = strtoupper($random->name(8));

      $coupon = Coupon::create([
        'code' => $code,
        'promotion_id' => $promotion->id(),
        'usage_limit' => 1,
        'status' => TRUE,
        'end_date' => $expiration->format('Y-m-d\TH:i:s'),
      ]);
      $coupon->save();

      return new JsonResponse(['coupon_code' => $code]);

    } catch (\Throwable $e) {
      \Drupal::logger('discount_wheel')->error($e->getMessage());
      return new JsonResponse(['error' => 'Internal server error'], 500);
    }
  }

  }
