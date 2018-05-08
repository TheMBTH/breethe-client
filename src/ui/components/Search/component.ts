import Component, { tracked } from '@glimmer/component';
import { assert } from '@orbit/utils';

export default class Home extends Component {

  @tracked
  locations = [];

  @tracked
  searchTerm = '';

  @tracked('locations', 'searchTerm')
  get showSearchResults() {
    return this.locations.length > 0 && this.searchTerm.length > 0;
  }

  constructor(options) {
    super(options);
    assert('Argument \'store\' must be supplied to this component.', this.args.store);
    this.searchTerm = this.args.searchTerm;
    if (this.searchTerm && this.searchTerm.length > 0) {
      this.loadLocations(this.searchTerm);
    }
  }

  async loadLocations(searchTerm) {
    this.locations = await this.args.store.query((q) =>
      q.findRecords('location')
       .filter({ attribute: 'city', value: searchTerm })
    );
  }

  goToRoute(search) {
    debugger;
    this.loadLocations(search);
    this.searchTerm = search;
    /**
     * This 'transition' doesn't trigger any update
     * in the component. We use it here to update
     * the URL parameter.
     */
    this.args.router.navigate(`/search/${search}`);
  }
}
