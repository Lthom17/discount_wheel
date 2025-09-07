<?php

namespace Drupal\discount_wheel\Form;

use Drupal\discount_wheel\Entity\DiscountWheelEntity;
use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;
use Drupal\commerce_promotion\Entity\Promotion;

class DiscountWheelForm extends EntityForm
{

    public function form(array $form, FormStateInterface $form_state)
    {
        /** @var DiscountWheelEntity $entity */
        $entity = $this->entity;

        $form['popup_title'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Popup Title'),
            '#description' => $this->t('This text appears at the top of the wheel popup box.'),
            '#default_value' => $entity->getPopupTitle(),
            '#required' => FALSE,
        ];

        $form['congrats_text'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Congratulations Text'),
            '#description' => $this->t('This text will appear on the popup after the the wheel selects a discount.'),
            '#default_value' => $entity->getCongratsText(),
            '#required' => FALSE,
        ];

        $form['disclaimer_text'] = [
            '#type' => 'textarea',
            '#title' => $this->t('Disclaimer'),
            '#description' => $this->t('Create your own disclaimer text or one will auto-populate for you.'),
            '#default_value' => $entity->getCongratsText(),
            '#required' => FALSE,
        ];

        $default_promotions = [];
        if (!empty($entity->getPromotions())) {
            foreach ($entity->getPromotions() as $promotion_id) {
                if ($promotion = Promotion::load($promotion_id)) {
                    $default_promotions[] = $promotion;
                }
            }
        }

        $form['promotions'] = [
            '#type' => 'entity_autocomplete',
            '#title' => $this->t('Promotions'),
            '#target_type' => 'commerce_promotion',
            '#tags' => TRUE,
            '#default_value' => $default_promotions,
            '#description' => $this->t('Select one or more Promotions to attach to this wheel. Promotion name must start with "DW".'),
            '#required' => TRUE,
            '#selection_handler' => 'filtered_promotion_selection',
        ];

        return parent::form($form, $form_state);
    }

    public function save(array $form, FormStateInterface $form_state)
    {
        $storage = \Drupal::entityTypeManager()->getStorage('discount_wheel');

        // Extract promotion IDs from form state.
        $promotion_entities = $form_state->getValue('promotions') ?? [];
        $promotion_ids = array_map(function ($item) {
            return is_array($item) && isset($item['target_id']) ? $item['target_id'] : $item;
        }, $promotion_entities);

        // Load or initialize the 'default' discount wheel entity.
        $entity = $storage->load('default') ?? $this->entity;
        $entity->set('id', 'default');
        $entity->set('promotions', $promotion_ids);

        // Save the entity.
        $entity->save();

        // Notify and redirect.
        $this->messenger()->addStatus($this->t('Discount wheel updated successfully.'));
        $form_state->setRedirect('<front>');
    }

}
