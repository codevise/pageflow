import {Base as BaseDomino} from '../../Base';

export const Base = BaseDomino.extend({
  selector: '.input'
});

Base.findByPropertyName = function(propertyName, options) {
  return this.findBy(
    el => el.data('inputPropertyName') === propertyName,
    {
      predicateName: `input property name '${propertyName}'`,
      ...options
    }
  )
}
