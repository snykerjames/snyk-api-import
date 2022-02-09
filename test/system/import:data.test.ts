import { exec } from 'child_process';
import { sep, join } from 'path';
import { deleteFiles } from '../delete-files';
const main = './dist/index.js'.replace(/\//g, sep);

describe('`snyk-api-import import:data <...>`', () => {
  const OLD_ENV = process.env;
  afterAll(async () => {
    process.env = { ...OLD_ENV };
  });
  it('Shows help text as expected', (done) => {
    exec(
      `node ${main} import:data help`,
      {
        env: {
          PATH: process.env.PATH,
          GITHUB_TOKEN: process.env.GH_TOKEN,
          SNYK_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatchSnapshot();
        done();
      },
    );
  });

  it('Generates repo data as expected for Gitlab', (done) => {
    const orgDataFile = 'test/system/fixtures/org-data/orgs.json';
    exec(
      `node ${main} import:data --source=gitlab --integrationType=gitlab --sourceUrl=${process.env.TEST_GITLAB_BASE_URL} --orgsData=${orgDataFile}`,
      {
        env: {
          PATH: process.env.PATH,
          GITLAB_TOKEN: process.env.TEST_GITLAB_TOKEN,
          SNYK_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'gitlab-import-targets.json')]);
        done();
      },
    );
  }, 20000);
  it('Generates repo data as expected for Bitbucket Server', (done) => {
    const orgDataFile =
      'test/system/fixtures/org-data/bitbucket-server-orgs.json';
    exec(
      `node ${main} import:data --source=bitbucket-server --integrationType=bitbucket-server --sourceUrl=${process.env.BBS_SOURCE_URL} --orgsData=${orgDataFile}`,
      {
        env: {
          PATH: process.env.PATH,
          BITBUCKET_SERVER_TOKEN: process.env.BBS_TOKEN,
          SNYK_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'bitbucket-server-import-targets.json')]);
        done();
      },
    );
  }, 50000);
  it('Generates repo data as expected for Bitbucket Cloud', (done) => {
    const orgDataFile =
      'test/system/fixtures/org-data/bitbucket-cloud-orgs.json';
    exec(
      `node ${main} import:data --source=bitbucket-cloud --integrationType=bitbucket-cloud --orgsData=${orgDataFile}`,
      {
        env: {
          PATH: process.env.PATH,
          BITBUCKET_CLOUD_USERNAME: process.env.BBC_USERNAME,
          BITBUCKET_CLOUD_PASSWORD: process.env.BBC_PASSWORD,
          SNYK_LOG_PATH: __dirname,
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
        expect(err).toBeNull();
        expect(stderr).toEqual('');
        expect(stdout.trim()).toMatch('Written the data to file');
        deleteFiles([join(__dirname, 'bitbucket-cloud-import-targets.json')]);
        done();
      },
    );
  }, 50000);
  it('Shows error when missing ', (done) => {
    exec(`node ${main} import:data --source=github`, (err, stdout, stderr) => {
      expect(err).toMatchSnapshot();
      expect(stderr).toMatchSnapshot();
      expect(stdout).toEqual('');
      done();
    });
  });
});
