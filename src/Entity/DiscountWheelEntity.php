<?php

namespace Drupal\discount_wheel\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\EntityTypeInterface;

/**
 * Defines the Discount Wheel configuration entity.
 *
 * @ConfigEntityType(
 *   id = "discount_wheel",
 *   label = @Translation("Discount Wheel"),
 *   handlers = {
 *     "form" = {
 *       "edit" = "Drupal\discount_wheel\Form\DiscountWheelForm"
 *     }
 *   },
 *   config_prefix = "discount_wheel",
 *   admin_permission = "administer site configuration",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label"
 *   },
 *   config_export = {
 *     "id",
 *     "label",
 *     "popup_title",
 *     "congrats_text",
 *     "promotions"
 *
 *   },
 *   links = {
 *     "edit-form" = "/admin/structure/discount-wheel/{discount_wheel}/edit"
 *   }
 * )
 */
class DiscountWheelEntity extends ConfigEntityBase
{
    public $popup_title;
    public $congrats_text;

    public $promotions;
    public $disclaimer_text;

public function getPopupTitle()
{
    return $this->popup_title;
}

public function getCongratsText()
{
    return $this->congrats_text;
}

public function getPromotions()
{
    return $this->promotions;
}

public function getDisclaimerText()
{
    return $this->disclaimer_text;
}

}
