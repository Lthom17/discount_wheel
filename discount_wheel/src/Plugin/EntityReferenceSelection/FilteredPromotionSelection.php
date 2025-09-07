<?php

namespace Drupal\discount_wheel\Plugin\EntityReferenceSelection;

use Drupal\Core\Entity\Exception\UnsupportedEntityTypeDefinitionException;
use Drupal\Core\Entity\Plugin\EntityReferenceSelection\DefaultSelection;
use Drupal\Core\Entity\Query\QueryInterface;

/**
 * Filters promotions by promotion name.
 * Promotions must start with DW (discount wheel) to
 * be returned by the filter
 *
 * @EntityReferenceSelection(
 *   id = "filtered_promotion_selection",
 *   label = @Translation("Filtered Promotion Selection"),
 *   group = "filtered_promotion_selection",
 *   weight = 0
 * )
 */
class FilteredPromotionSelection extends DefaultSelection
{

  /**
   * {@inheritdoc}
   * @throws UnsupportedEntityTypeDefinitionException
   */
  protected function buildEntityQuery($match = NULL, $match_operator = 'CONTAINS'): QueryInterface {
    //Settings are passed to plugin from form element and stored in configuration array
    $query = $this->entityTypeManager->getStorage($this->configuration['target_type'])->getQuery();
    $query->accessCheck(TRUE);
    $query->condition('name', 'DW', 'STARTS_WITH');

    //further filtering based on what the user is typing into autocomplete
    if (isset($match)) {
      $query->condition('name', $match, 'CONTAINS');
    }

    return $query;
  }


}
