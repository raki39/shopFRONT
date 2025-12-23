#!/usr/bin/env node

/**
 * Script para verificar se o frontend está pronto para deploy na Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando se o frontend está pronto para deploy na Vercel...\n');

let allGood = true;

// 1. Verificar package.json
console.log('1️⃣  Verificando package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts.build) {
    console.log('   ❌ Script "build" não encontrado');
    allGood = false;
  } else {
    console.log('   ✅ Script "build" encontrado');
  }
  
  if (!packageJson.scripts.start) {
    console.log('   ❌ Script "start" não encontrado');
    allGood = false;
  } else {
    console.log('   ✅ Script "start" encontrado');
  }
  
  if (!packageJson.dependencies.next) {
    console.log('   ❌ Next.js não encontrado nas dependências');
    allGood = false;
  } else {
    console.log('   ✅ Next.js encontrado:', packageJson.dependencies.next);
  }
} catch (error) {
  console.log('   ❌ Erro ao ler package.json:', error.message);
  allGood = false;
}

// 2. Verificar next.config.ts
console.log('\n2️⃣  Verificando next.config.ts...');
if (fs.existsSync('next.config.ts') || fs.existsSync('next.config.js')) {
  console.log('   ✅ Arquivo de configuração do Next.js encontrado');
} else {
  console.log('   ❌ next.config.ts/js não encontrado');
  allGood = false;
}

// 3. Verificar .env.example
console.log('\n3️⃣  Verificando .env.example...');
if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (envExample.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ✅ .env.example contém NEXT_PUBLIC_API_URL');
  } else {
    console.log('   ⚠️  .env.example não contém NEXT_PUBLIC_API_URL');
  }
} else {
  console.log('   ⚠️  .env.example não encontrado (opcional)');
}

// 4. Verificar vercel.json
console.log('\n4️⃣  Verificando vercel.json...');
if (fs.existsSync('vercel.json')) {
  console.log('   ✅ vercel.json encontrado');
} else {
  console.log('   ⚠️  vercel.json não encontrado (opcional)');
}

// 5. Verificar estrutura de pastas
console.log('\n5️⃣  Verificando estrutura de pastas...');
const requiredDirs = ['app', 'components', 'lib', 'public'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ Pasta "${dir}" encontrada`);
  } else {
    console.log(`   ❌ Pasta "${dir}" não encontrada`);
    allGood = false;
  }
});

// 6. Verificar lib/api.ts
console.log('\n6️⃣  Verificando lib/api.ts...');
if (fs.existsSync('lib/api.ts')) {
  const apiContent = fs.readFileSync('lib/api.ts', 'utf8');
  if (apiContent.includes('process.env.NEXT_PUBLIC_API_URL')) {
    console.log('   ✅ API configurada para usar NEXT_PUBLIC_API_URL');
  } else {
    console.log('   ❌ API não está usando NEXT_PUBLIC_API_URL');
    allGood = false;
  }
} else {
  console.log('   ❌ lib/api.ts não encontrado');
  allGood = false;
}

// 7. Verificar .gitignore
console.log('\n7️⃣  Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env') && gitignore.includes('node_modules')) {
    console.log('   ✅ .gitignore configurado corretamente');
  } else {
    console.log('   ⚠️  .gitignore pode estar incompleto');
  }
} else {
  console.log('   ❌ .gitignore não encontrado');
  allGood = false;
}

// Resultado final
console.log('\n' + '='.repeat(60));
if (allGood) {
  console.log('✅ TUDO PRONTO PARA DEPLOY NA VERCEL! 🚀');
  console.log('\nPróximos passos:');
  console.log('1. Commit e push do código');
  console.log('2. Acesse https://vercel.com/new');
  console.log('3. Importe o repositório');
  console.log('4. Configure Root Directory: frontend');
  console.log('5. Adicione variável: NEXT_PUBLIC_API_URL');
  console.log('6. Deploy! 🎉');
} else {
  console.log('❌ ALGUNS PROBLEMAS ENCONTRADOS');
  console.log('\nCorreja os erros acima antes de fazer deploy.');
  process.exit(1);
}
console.log('='.repeat(60) + '\n');

