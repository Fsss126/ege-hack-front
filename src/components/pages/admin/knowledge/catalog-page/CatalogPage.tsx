import {useCheckPermissions} from 'components/ConditionalRender';
import {ButtonsBlock} from 'components/layout/ButtonsBlock';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {ADMIN_ROLES} from 'definitions/constants';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import React from 'react';
import {Link} from 'react-router-dom';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithParentProps} from 'types/routes';

import {KnowledgeCatalog} from './KnowledgeCatalog';

const CatalogPage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {location, url} = props;
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const canEdit = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);

  const header = (
    <>
      <ContentBlock title="База заданий" titleInside titleBig />
      {canEdit && (
        <ButtonsBlock stacked>
          <Button
            neutral
            component={Link}
            to={`${url}/theme/create/`}
            after={<i className="icon-add" />}
          >
            Добавить тему
          </Button>
          <Button
            neutral
            component={Link}
            to={`${url}/task/create/`}
            after={<i className="icon-add" />}
          >
            Добавить задачу
          </Button>
        </ButtonsBlock>
      )}
    </>
  );

  const isLoaded = !!subjects;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredRoles={ADMIN_ROLES}
      fullMatch={false}
      className="admin-page admin-page--knowdlege"
      title="Управление курсами"
      location={location}
      errors={[errorLoadingSubjects]}
      reloadCallbacks={[reloadSubjects]}
    >
      {!!subjects && (
        <PageContent>
          <KnowledgeCatalog subjects={subjects} header={header} url={url} />
        </PageContent>
      )}
    </Page>
  );
};

export default CatalogPage;
