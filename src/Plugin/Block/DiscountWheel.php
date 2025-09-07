<?php

namespace Drupal\discount_wheel\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\commerce_promotion\Entity\Promotion;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 * @Block(
 *   id = "discount_wheel_block",
 *   admin_label = @Translation("Display Discount Wheel")
 * )
 */
class DiscountWheel extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The config factory.
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, ConfigFactoryInterface $config_factory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('config.factory')

    );
  }


  /**
   * {@inheritdoc}
   */
  public function build()
  {

    $storage = $this->entityTypeManager->getStorage('discount_wheel');
    $wheel = $storage->load('default');

    $config = $this->configFactory->get('discount_wheel.settings');

    if (!$wheel) {

      $values = [
        'id' => 'default',
        'popup_title' => $config->get('popup_title'),
        'congrats_text' => $config->get('congrats_text'),
        'disclaimer_text' => $config->get('disclaimer_text'),
        'promotions' => $config->get('promotions'),
      ];
      $wheel = $storage->create($values);
    }

    if(!$wheel->get('disclaimer_text')){
      $wheel->set('disclaimer_text', $config->get('disclaimer_text'));
    }

    $promotion_ids = $wheel->getPromotions();
    $slices = isset($promotion_ids) ? $promotion_ids->parsePromotions($promotion_ids) : [];

    return [
      '#theme' => 'discount_wheel_block',
      '#attached' => [
        'library' => [
          'discount_wheel/react_core',
        ],
        'drupalSettings' => [
          'discountWheel' => [
            'popupTitle' => $wheel->get('popup_title'),
            'congratsText' => $wheel->get('congrats_text'),
            'slices' => $slices,
            'disclaimerText' => $wheel->get('disclaimer_text'),
          ],
        ],
      ],
    ];
  }

  private function parsePromotions(array $promotion_ids)
  {
    $slices = [];

    $promotions = Promotion::loadMultiple($promotion_ids);



    foreach ($promotions as $promotion) {
      $offer = $promotion->getOffer();
      $offer_config = $offer->getConfiguration();
      $discount = '';
      $offer_type = '';

      if (isset($offer_config['percentage'])) {
        $discount = $offer_config['percentage'] * 100;
        $offer_type = 'percentage';
      } else if (isset($offer_config['amount'])) {
        $discount = floatval($offer_config['amount']['number']);
        $offer_type = 'amount';
      }

      $slices[] = [
        'discount' => $discount,
        'offer_type' => $offer_type,
        'promotion_id' => $promotion->id(),
      ];
    }

    return $slices;
  }
}
