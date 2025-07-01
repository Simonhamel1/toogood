# Configuration alternative avec token personnel

Si le déploiement automatique ne fonctionne pas avec les permissions par défaut :

## Créer un Personal Access Token (PAT)

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez "Generate new token (classic)"
3. Donnez un nom : "toogood-deploy"
4. Sélectionnez l'expiration : 90 days ou No expiration
5. Cochez les permissions :
   - repo (tous)
   - workflow
   - write:packages
   - delete:packages

6. Cliquez "Generate token"
7. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir)

## Ajouter le token aux secrets du repository

1. Dans votre repo → Settings → Secrets and variables → Actions
2. Cliquez "New repository secret"
3. Name: `DEPLOY_TOKEN`
4. Value: collez votre token
5. Cliquez "Add secret"

## Modifier le workflow (si nécessaire)

Si vous devez utiliser le token personnel, changez la ligne :
```yaml
github_token: ${{ secrets.GITHUB_TOKEN }}
```
par :
```yaml
github_token: ${{ secrets.DEPLOY_TOKEN }}
```
